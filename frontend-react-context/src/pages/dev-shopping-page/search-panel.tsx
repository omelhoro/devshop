import * as React from 'react';
import { Fetch } from 'react-request';
import Composer from 'react-composer';
import urlJoin from 'url-join';
import qS from 'query-string';
import { BACKEND_ENDPOINT } from '../../utils/vars';

export const getValue = (elem) => document
	.querySelector(elem)
	.value;

export default ({ onDevResult }) => (
	<Composer components={[
		<Fetch lazy url={urlJoin(BACKEND_ENDPOINT, 'api/github/developer')}
			afterFetch={({ data }) => onDevResult(data)}
		/>,
		<Fetch lazy
			url={urlJoin(BACKEND_ENDPOINT, 'api/github/members-of-org?orgName=')}
			afterFetch={({ data }) => onDevResult(data)}
		/>,
	]}>
		{([{ doFetch: getDeveloperByName, url: devUrl, fetching: devLoading },
			{ doFetch: getDevelopersByOrg, url: orgUrl, fetching: orgLoading }]) => (
				<div>
					<div
						className="row"
					>
						<div className="col-sm-8 ">
							<form
								action="#"
								onSubmit={(evt) => {
									evt.preventDefault();
									if (!getValue('#dev-name')) { return; }
									getDeveloperByName({
										url:
											`${qS.parseUrl(devUrl).url}?${qS.stringify({ name: getValue('#dev-name') })}`
									});
								}}
							>
								<div className="input-group mb-3">
									<div
										className="input-group-prepend"
									>
										<span
											className="input-group-text"
											style={{ minWidth: '150px' }}
										>
											By User
									</span>
									</div>
									<input
										id="dev-name"
										className="form-control"
										type="text"
										placeholder="e.g. omelhoro"
									/>
									<div className="input-group-append">
										<button
											id="import-developer"
											className="btn btn-outline-secondary"
											type="submit"
											style={{
												display: 'inline-flex',
												minWidth: '110px',
											}}
										>
											{devLoading ? (
												<i className="fa fa-spinner fa-spin" style={{ padding: '4px' }}>
												</i>
											) : (
													<i className="material-icons" style={{ marginRight: '4px' }}>person</i>
												)}
											<span>
												Import!
										</span>
										</button>
									</div>
								</div>
							</form>

						</div>
					</div>

					<div
						className="row"
					>
						<div className="col-sm-8 ">
							<form
								action="#"
								onSubmit={(evt) => {
									evt.preventDefault();
									if (!getValue('#org-name')) { return; }
									getDevelopersByOrg({ url: `${qS.parseUrl(orgUrl).url}?${qS.stringify({ orgName: getValue('#org-name') })}` });
								}}
							>
								<div className="input-group mb-3">
									<span
										className="input-group-prepend"
									>
										<div className="input-group-text" style={{ minWidth: '150px' }}>
											By Organization
									</div>
									</span>
									<input id="org-name" className="form-control" type="text" placeholder="e.g. Homebrew" />
									<span className="input-group-append">
										<button
											id="import-organization"
											className="btn btn-outline-secondary"
											type="submit"
											style={{
												display: 'inline-flex',
												minWidth: '110px',
											}}
										>
											{orgLoading ? (
												<i className="fa fa-spinner fa-spin" style={{ padding: '4px' }}>
												</i>
											) :
												(
													<i className="material-icons" style={{ marginRight: '4px' }}>group</i>
												)}
											<span>
												Import!
										</span>
										</button>
									</span>
								</div>
							</form>
							<div
								// hidden={!resultsLoading}
								hidden
								className="progress"
							>
								<div
									className="progress-bar progress-bar-striped progress-bar-animated"
									role="progressbar"
									aria-valuenow={75}
									aria-valuemin={0}
									aria-valuemax={100}
									style={{
										width: '100%',
									}}
								>
								</div>
							</div>

						</div>

					</div>

				</div>
			)}
	</Composer>
);
