import * as Snackbar from 'node-snackbar';
import 'node-snackbar/dist/snackbar.min.css';
import errorParser from './error-parser';

export default function* handleAjaxError(error, visual = true) {
	console.error(error);
	try {
		const msg = yield errorParser(error);
		if (visual) {
			Snackbar.show({ text: msg, pos: 'bottom-center', actionTextColor: '#ff0000' });
		}
		return msg;
	} catch (err) {
		console.error(err);
		return '';
	}
}
