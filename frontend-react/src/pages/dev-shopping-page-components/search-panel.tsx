import * as React from 'react';

export const getValue = elem => document
	.querySelector(elem)
	.value;

interface ISearchPanelProps {
	addDevFromName(name: string): void,
	developers: any[],
	resultsLoading: boolean;
	addDevFromOrgName(name: string): void,
}

export default class SearchPanel extends React.Component<ISearchPanelProps, any> {

	render() {
		return (
			<div>
				<div
					className="row"
				>
					<div className="col-sm-8 ">
						<form
							action="#"
							onSubmit={(evt) => {
								evt.preventDefault();
								this.props.addDevFromName(getValue('#dev-name'));
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
									autoFocus={!this.props.developers.length}
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
										{this.props.resultsLoading ? (
											<i className="fa fa-spinner fa-spin" style={{ padding: '4px' }}>
											</i>
										) :
											(
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
								this.props.addDevFromOrgName(getValue('#org-name'));
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
										{this.props.resultsLoading ? (
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
							// hidden={!this.props.resultsLoading}
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
		);
	}
}
