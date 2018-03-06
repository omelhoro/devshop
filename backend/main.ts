
import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { getMembersOfOrg, getDeveloper } from './api/githubApi';
import { processOrder, getOrder } from './api/processOrder';

const isDeveloping = process.env.NODE_ENV !== 'production';

const app = express();

app.use(bodyParser.json());

if (isDeveloping) {
	const cors = require('cors');
	app.use(cors());
}

app.get('/api/members', getMembersOfOrg);
app.get('/api/developer', getDeveloper);
app.post('/api/order', processOrder);
app.get('/api/order', getOrder);

if (isDeveloping) {
	console.log('Dev env');
} else {
	app.use(express.static(path.join(__dirname, './dist')));
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, './dist/index.html'));
	});
}

const port = 10001;
const host = '0.0.0.0';

app.listen(10001, host, (err) => {
	if (err) {
		console.log(err);
	}
	console.info('==> 🌎 Listening on port %s. Open up http://%s:%s/ in your browser.', port, host, port);
	console.log(`Server is now running at http://${host}:${port}.`);
});
