import { errorHandler } from '../lib/utils';
import { sendToken } from '../lib/emailService';

const Bluebird = require('bluebird');
const levelup = require('levelup');
const leveldown = require('leveldown');
const uuid = require('node-uuid');

const db = Bluebird.promisifyAll(levelup(leveldown(process.env.DB_PATH || './db')));

async function processOrderAsync(req, res) {
	const token = uuid.v1();

	// TODO: we need a more secure way to verify the price than thrust in the client
	const sumWithoutCoupon = req.body.cart.reduce((agg, curr) => (
		curr.appAdded.orderedHours *
		curr.appAdded.price
	) + agg, 0);

	const { coupon } = req.body;
	let sum;
	if (sum && coupon === 'SHIPIT') {
		sum = Math.ceil(sumWithoutCoupon - (sumWithoutCoupon * 0.1));
	} else {
		sum = sumWithoutCoupon;
	}

	await db.putAsync(token, JSON.stringify({
		...req.body, sum, token, timestamp: new Date().toJSON(),
	}));
	const matchHost = /^https?:\/\/.*\//;
	let host = '';
	let rest = null;
	if (req.headers && req.headers.referer) {
		[host, ...rest] = matchHost.exec(req.headers.referer);
	} else {
		host = req.get ? req.get('host') : '';
	}
	if (req.body.email) {
		sendToken({ to: req.body.email, host, token }, console.log);
	}
	res.send({ token });
}

async function getOrderAsync(req, res) {
	if (!req.query.token) {
		return errorHandler(res, 401, 'NO_TOKEN_SUPPLIED');
	}
	try {
		const value = await db.getAsync(req.query.token);
		return res.send(JSON.parse(value || '{}'));
	} catch (error) {
		return errorHandler(res, 401, 'TOKEN_INVALID');
	}
}

export const processOrder = (req, res) =>
	processOrderAsync(req, res)
		.catch(error => errorHandler(res, 500, error.toString()));

export const getOrder = (req, res) =>
	getOrderAsync(req, res)
		.catch(error => errorHandler(res, 500, error.toString()));


function exitHandler(options, err) {
	console.log('Exiting');
	process.stdin.resume(); // so the program will not close instantly

	db.close(() => {
		console.log('close db');
		process.exit();
	});

	if (options.cleanup) {
		console.log('clean');
	}
	if (err) {
		console.log(err.stack);
	}
	if (options.exit) {
		db.close(() => {
			console.log('close db');
			process.exit();
		});
	}
}

// // do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));
//
// // catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));
//
// // catches "kill pid" (for example: nodemon restart)
// process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
// process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));
//
// // catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
