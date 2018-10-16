import * as React from 'react';

export const getValue = (elem) => document
	.querySelector(elem)
	.value;

export default ({ loading, getOrganisation }) => (
	<form
		action="#"
		style={{ width: '100%' }}
		onSubmit={(evt) => {
			evt.preventDefault();
			const orgName = getValue('#org-name');
			if (!orgName) { return; }
			getOrganisation(orgName);
		}}
	>
		<div className="input-group mb-3">
			<span
				className="input-group-prepend"
			>
				<div className="input-group-text" style={{ minWidth: '85px' }}>
					By Org
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
					{loading ? (
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
);
