
import 'isomorphic-fetch';

import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import GithubRoute from './api/github-route';
import OrdersRoute from './api/orders-route';
import registerAPINamespace, { registerMiddlewareErrorHandling } from './api/utils/register-class-api-namespace';

const isDeveloping = process.env.NODE_ENV !== 'production';

const app = express();

app.use(bodyParser.json());

if (isDeveloping) {
	// tslint:disable-next-line
	app.use(require('cors')());
}

registerAPINamespace('github', GithubRoute, app);
registerAPINamespace('orders', OrdersRoute, app);
registerMiddlewareErrorHandling(app);

app.use(express.static(path.join(__dirname, './www')));
app.get('/ng/*', (req, res) => {
	res.sendFile(path.join(__dirname, './www/ng/index.html'));
});
app.get('/react/*', (req, res) => {
	res.sendFile(path.join(__dirname, './www/react/index.html'));
});

const port = 10001;
const host = '0.0.0.0';

app.listen(port, host, (err) => {
	if (err) {
		console.log(err);
	}
	console.info('==> 🌎 Listening on port %s. Open up http://%s:%s/ in your browser.', port, host, port);
	console.log(`Server is now running at http://${host}:${port}.`);
});
