import 'colors';
import { kebabCase } from 'lodash';

// tslint:disable-next-line
const debug = require('debug')('app:routes');

const stackFilter = new Set([
	'at Generator.next (<anonymous>)',
	'at <anonymous>',
	'at Function.<anonymous>',
	'at new Promise (<anonymous>)',
	'at process._tickCallback (internal/process/next_tick.js:118:7)',
]);

export const errorHandler = (res, stage, method, route) => (err) => {
	const message = err.message || 'An unknown error happened.';
	const enumKey = err.enumKey || 'UNKNOWN_ERROR';
	const stack = err.stack.split('\n').slice(0, 5).filter((line) => !stackFilter.has(line.trim())).join('\n');
	// tslint:disable-next-line
	debug(`  ${stage} =`.red, enumKey.underline, method.toUpperCase(), route.green, '\n', ' STACK ='.yellow, stack.grey);
	res.status(err.status || 500).json({ message, enumKey });
};

export function registerMiddlewareErrorHandling(appRef) {
	appRef.use((err, _req, res, _next) => errorHandler(res, 'MIDDLEWARE-ERROR', '', '')(err));
}

export function registerApiRoutes(routes, app) {
	Object.entries(routes)
		.filter(([routeName]) => routeName.endsWith('Route'))
		.forEach(([, route]) => registerApiNamespace(route, app));
}

export default function registerApiNamespace(nsobj, appRef) {
	const namespace = nsobj.entityName;
	debug(`Registering namespace '${namespace}':`);
	const functions = Object.getOwnPropertyNames(nsobj)
		.filter((prop) => typeof nsobj[prop] === 'function');

	return functions
		.forEach((funcName) => {

			const func = nsobj[funcName];
			let method = '';
			switch (true) {
				case funcName.startsWith('get'):
					method = 'get';
					break;
				case funcName.startsWith('save'):
				case funcName.startsWith('create'):
				case funcName.startsWith('post'):
					method = 'post';
					break;
				case funcName.startsWith('update'):
				case funcName.startsWith('patch'):
				case funcName.startsWith('put'):
					method = 'put';
					break;
				case funcName.startsWith('remove'):
				case funcName.startsWith('delete'):
					method = 'delete';
					break;
				default:
					debug('registering default route =', funcName);
					method = 'use';
					break;
			}

			const methodRegEx = /^(get|create|save|post|patch|update|put|remove|delete)/;

			// replace REST method, rename method to kebac case - getUserImage -> user-image
			const fnEndpoint = kebabCase(funcName.replace(methodRegEx, ''));

			// get middleware of the function and filter for undefined
			const middleware = (func.md || []).filter((fun) => typeof fun === 'function');
			const middlewareNames = middleware.map((middlewareFunc) => middlewareFunc.name).join('->');
			let route = '/api';
			if ([fnEndpoint, `${fnEndpoint}s`].indexOf(namespace) >= 0) {
				route += `/${namespace}`;
			} else if (fnEndpoint === 'by-id') {
				route += `/${namespace}/:id`;
			} else if (fnEndpoint.indexOf('-by-id') >= 0) {
				route += `/${namespace}/:id/${fnEndpoint.replace('-by-id', '')}`;
			} else {
				route += `/${namespace}/${fnEndpoint}`;
			}

			// strip trailing slash
			route = route.replace(/\/$/, '');

			// tslint:disable-next-line:max-line-length
			debug(`${method.toLocaleUpperCase().padEnd(4).green} ${route.padEnd(25, '_')} {fn: ${(funcName.slice(0, 14)).padEnd(14)} MD: ${middlewareNames || '<none>'}}`); // eslint-disable-line

			appRef[method](route, ...middleware, (...args) => {
				const res = args[1];
				nsobj[funcName](...args)
					.then((result) => res.json(result))
					.catch(errorHandler(res, 'ENDPOINT-ERROR', method, route));
			});

		});

}
