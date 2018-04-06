import * as Bluebird from 'bluebird';
import * as GitHubApi from 'github';
import { errorHandler, calculateHoursPrice } from './utils/utils';
import { github as githubCreds } from '../vault/secret/credentials';

const github = new GitHubApi({
	// required
	// version: '3.0.0',
	// optional
	// debug: true,
	protocol: 'https',
	host: 'api.github.com', // should be api.github.com for GitHub
	// pathPrefix: '/api/v3', // for some GHEs; none for GitHub
	timeout: 5000,
	headers: {
		'user-agent': 'My-Cool-GitHub-App', // GitHub is happy with a unique user agent
	},
});

github.authenticate({
	type: 'oauth',
	token: githubCreds.token,
});

async function getSingleUser({ login }) {
	const out = await Bluebird.promisify(github.users.getForUser)({ username: login });
	const user = out.data;
	return { ...user, appAdded: { price: calculateHoursPrice(user), orderedHours: 0 } };
}

export default class GithubRoute {

	static async getMembersOfOrg(req, res) {
		const name = req.query.orgName;
		if (!name) {
			errorHandler(res, 500, 'EMPTY_PARAM');
			return;
		}

		const out = await Bluebird.promisify(github.orgs.getMembers)({ org: name });
		const enrichedData = await Promise.all(out.data.map(getSingleUser));
		return enrichedData;
	}

	static async getDeveloper(req, res) {
		const { name } = req.query;
		if (!name) {
			errorHandler(res, 500, 'EMPTY_PARAM');
			return;
		}

		const out = await getSingleUser({ login: name });
		return out;
	}
}