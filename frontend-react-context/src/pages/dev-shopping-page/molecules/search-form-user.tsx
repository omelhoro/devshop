import * as React from 'react';

export const getValue = (elem) => document
	.querySelector(elem)
	.value;

export default ({ loading, getDeveloper }) => (
	<form
		action="#"
		style={{ width: '100%' }}
		onSubmit={(evt) => {
			evt.preventDefault();
			const name = getValue('#dev-name');
			if (!name) { return; }
			getDeveloper(name);
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
					{loading ? (
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

);
