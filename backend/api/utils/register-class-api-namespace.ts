import * as _ from 'lodash';
import * as _debug from 'debug';
import 'colors';

const debug = _debug('app:routes');

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
	console.error(`  ${stage} =`.red, enumKey.underline, method.toUpperCase(), route.green, '\n', ' STACK ='.yellow, stack.grey);
	res.status(err.status || 500).json({ message, enumKey });
};

export function registerMiddlewareErrorHandling(appRef) {
	appRef.use((err, req, res, next) => errorHandler(res, 'MIDDLEWARE-ERROR', '', '')(err));
}

export default function registerAPINamespace(namespace, nsobj, appRef) {
	debug(`Registering namespace '${namespace}':`);
	const functions = Object.getOwnPropertyNames(nsobj)
		.filter((prop) => typeof nsobj[prop] === 'function');

	return functions.forEach((fnname: any) => {

		const func = nsobj[fnname];
		let method = '';
		switch (true) {
			case fnname.startsWith('get'):
				method = 'get';
				break;
			case fnname.startsWith('create'):
			case fnname.startsWith('post'):
				method = 'post';
				break;
			case fnname.startsWith('patch'):
			case fnname.startsWith('put'):
				method = 'put';
				break;
			case fnname.startsWith('remove'):
			case fnname.startsWith('delete'):
				method = 'delete';
				break;
			default:
				debug('registering default route =', fnname);
				method = 'use';
				break;
		}

		const methodRegEx = /^(get|create|post|patch|put|remove|delete)/;

		// replace REST method, rename method to kebac case - getUserImage -> user-image
		const fnEndpoint = _.kebabCase(fnname.replace(methodRegEx, ''));

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

		// tslint:disable-next-line:max-line-length
		debug(`${(method.toLocaleUpperCase() as any).padEnd(4)} = ${(route as any).padEnd(25, '_')} {fn: ${(fnname.slice(0, 14)).padEnd(14)} Middleware: ${middlewareNames || '<none>'}}`); // eslint-disable-line

		appRef[method](route, ...middleware, (...args) => {
			const res = args[1];
			nsobj[fnname](...args)
				.then((result) => res.json(result))
				.catch(errorHandler(res, 'ENDPOINT-ERROR', method, route));
		});

	});

}
