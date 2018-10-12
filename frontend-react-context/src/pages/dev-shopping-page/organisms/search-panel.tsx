import * as React from 'react';
import { Fetch } from 'react-request';
import Composer from 'react-composer';
import qS from 'query-string';
import url from '../../../utils/url';
import SearchFormUser from '../molecules/search-form-user';
import SearchFormOrg from '../molecules/search-form-organisations';
import { Consumer, IContext } from '../../../store-provider';

export const getValue = (elem) => document
	.querySelector(elem)
	.value;

export const Component = ({ onDevResult }) => (
	<Composer components={[
		<Fetch lazy url={url('github/developer')}
			afterFetch={({ data }) => onDevResult(data)}
		/>,
		<Fetch lazy
			url={url('github/members-of-org')}
			afterFetch={({ data }) => onDevResult(data)}
		/>,
	]}>
		{([{ doFetch: getDeveloperByName, url: devUrl, fetching: devLoading },
			{ doFetch: getDevelopersByOrg, url: orgUrl, fetching: orgLoading }]) => (
				<div>
					<div
						className="row"
					>
						<SearchFormUser
							loading={devLoading}
							getDeveloper={(name) => getDeveloperByName({
								url:
									`${qS.parseUrl(devUrl).url}?${qS.stringify({ name })}`
							})}
						/>

					</div>

					<div
						className="row"
					>
						<SearchFormOrg
							loading={orgLoading}
							getOrganisation={(orgName) =>
								getDevelopersByOrg({
									url:
										`${qS.parseUrl(orgUrl).url}?${qS.stringify({ orgName })}`
								})
							} />

					</div>

				</div>
			)}
	</Composer>
);

export default () => (
	<Consumer>
		{(context: IContext) => <Component onDevResult={(data) => context.actions.addDevelopers([].concat(data))} />}
	</Consumer>
);
