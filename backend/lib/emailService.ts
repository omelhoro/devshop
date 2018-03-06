import * as urlJoin from 'url-join';
import { mailgun as mailgunCreds } from '../vault/secret/credentials';

const mailgun = require('mailgun-js')({ apiKey: mailgunCreds.apiKey, domain: mailgunCreds.domain });

export function sendToken({ to, token, host }, callback) {
	const url = urlJoin(host, 'show-order', `?token=${token}`);
	console.log('using this url=', url);

	const text = `You can view your complete order by using this token:
    ${url}`;

	const data = {
		from: 'Your VTEX codechallenge <me@samples.mailgun.org>',
		to,
		subject: 'Token for shopping order',
		text,
	};

	mailgun.messages().send(data, callback);
}

export default sendToken;
