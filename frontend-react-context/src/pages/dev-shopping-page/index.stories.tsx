import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CartListEntry from './molecules/cart-list-entry';
import DevListEntry from './molecules/dev-list-entry';
import SearchPanel from './organisms/search-panel';
import Pagination from './molecules/pagination';
import SearchFormUser from './molecules/search-form-user';
import DevImage from './molecules/atoms/dev-image';
import { Component as DevList } from './organisms/dev-list';
import { Component as CartPanel } from './organisms/cart-panel';

// tslint:disable-next-line
const developer1 = { login: 'omelhoro', id: 7503696, node_id: 'MDQ6VXNlcjc1MDM2OTY=', avatar_url: 'https://avatars1.githubusercontent.com/u/7503696?v=4', gravatar_id: '', url: 'https://api.github.com/users/omelhoro', html_url: 'https://github.com/omelhoro', followers_url: 'https://api.github.com/users/omelhoro/followers', following_url: 'https://api.github.com/users/omelhoro/following{/other_user}', gists_url: 'https://api.github.com/users/omelhoro/gists{/gist_id}', starred_url: 'https://api.github.com/users/omelhoro/starred{/owner}{/repo}', subscriptions_url: 'https://api.github.com/users/omelhoro/subscriptions', organizations_url: 'https://api.github.com/users/omelhoro/orgs', repos_url: 'https://api.github.com/users/omelhoro/repos', events_url: 'https://api.github.com/users/omelhoro/events{/privacy}', received_events_url: 'https://api.github.com/users/omelhoro/received_events', type: 'User', site_admin: false, name: 'Igor Fischer', company: 'Software-Engineer', blog: 'https://home.fischerops.com', location: 'Hamburg', email: 'igor.fischer154@gmail.com', hireable: true, bio: 'Lambda wins', public_repos: 36, public_gists: 0, followers: 7, following: 8, created_at: '2014-05-06T18:16:27Z', updated_at: '2018-10-02T09:40:03Z', appAdded: { price: 16, orderedHours: 10, totalSum: 160 } };

const developer2 = {
	login: 'adidalal',
	id: 2555394,
	node_id: 'MDQ6VXNlcjI1NTUzOTQ=',
	avatar_url: 'https://avatars0.githubusercontent.com/u/2555394?v=4',
	gravatar_id: '',
	url: 'https://api.github.com/users/adidalal',
	html_url: 'https://github.com/adidalal',
	followers_url: 'https://api.github.com/users/adidalal/followers',
	following_url: 'https://api.github.com/users/adidalal/following{/other_user}',
	gists_url: 'https://api.github.com/users/adidalal/gists{/gist_id}',
	starred_url: 'https://api.github.com/users/adidalal/starred{/owner}{/repo}',
	subscriptions_url: 'https://api.github.com/users/adidalal/subscriptions',
	organizations_url: 'https://api.github.com/users/adidalal/orgs',
	repos_url: 'https://api.github.com/users/adidalal/repos',
	events_url: 'https://api.github.com/users/adidalal/events{/privacy}',
	received_events_url: 'https://api.github.com/users/adidalal/received_events',
	type: 'User',
	site_admin: false,
	name: 'Aditya Dalal',
	company: null,
	blog: 'adityadalal.com',
	location: 'New York',
	email: null,
	hireable: null,
	bio: null,
	public_repos: 9,
	public_gists: 3,
	followers: 25,
	following: 12,
	created_at: '2012-10-14T04:54:46Z',
	updated_at: '2018-08-17T02:42:38Z',
	appAdded: {
		price: 20,
		orderedHours: 0
	}
};

storiesOf('dev-shopping-page/molecules', module)
	.add('cart-list-entry', () => (
		<CartListEntry element={developer1} removeFromCart={action('removed')} />
	)).add('dev-list-entry', () => (
		<DevListEntry
			element={developer1}
			addDevelopersToCart={action('added')}
			isInCart={true} onHoursChange={action('changed hours')}
			removeFromCart={action('removed')} />
	)).add('pagination', () => (
		<Pagination currentPage={2} pages={10} onPageChange={action('page-change')} />
	)).add('search-form-user/loading', () => <SearchFormUser getDeveloper={action('get-dev')} loading={true} />)
	.add('search-form-user/not-loading', () => <SearchFormUser getDeveloper={action('get-dev')} loading={false} />);

storiesOf('dev-shopping-page/atoms', module)
	.add('dev-image', () => (
		<DevImage src={developer1.avatar_url} alt={developer1.login} />
	)).add('loader', () => (
		<div id="loader" />
	));

const mockedContext = { developers: [developer1, developer2], developersInCart: [developer1], currentPage: 0 };
storiesOf('dev-shopping-page/organisms', module)
	.add('dev-list', () => (
		<DevList context={mockedContext} />
	)).add('search-panel', () => (
		<SearchPanel />
	)).add('cart-panel', () => (
		<CartPanel context={mockedContext} />
	));
