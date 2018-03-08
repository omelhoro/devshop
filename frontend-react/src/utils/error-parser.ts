import { ERROR_CODES } from 'app-constants';

export default function* errorParser(error) {
	try {
		if (error.json) {
			const msg = yield error.json();
			const resolvedMsg = ERROR_CODES[msg.value];
			if (!resolvedMsg) {
				console.info('Server returned an unresolved error', msg.value);
				return ERROR_CODES.UNKNOWN_ERROR;
			} else {
				return resolvedMsg;
			}
		} else {
			return ERROR_CODES.UNKNOWN_ERROR;
		}
	} catch (err) {
		return ERROR_CODES.UNKNOWN_ERROR;
	}
}
