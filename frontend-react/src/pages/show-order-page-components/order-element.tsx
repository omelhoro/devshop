import * as React from 'react';

export default ({ developer }) => (
	<div key={`${developer.login}-bought`} className="well developer-entry">
		<div className="media">
			<div className="media-left media-top">
				<div>
					<img
						src={developer.avatar_url}
						alt={developer.login}
						style={{
							maxWidth: 160,
							boxShadow: '4px 3px 3px black',
							margin: '20px',
							border: '1px solid grey',
						}}
					/>
				</div>
			</div>
			<div className="media-body">
				<h4 className="media-heading">
					{developer.login}
				</h4>

				<table className="table table-bordered table-hovered">
					<tbody>

						<tr>
							<td>Followers</td>
							<td>{developer.followers}</td>
						</tr>
						<tr>
							<td>Gists</td>
							<td>{developer.public_gists}</td>
						</tr>
						<tr>
							<td>Repos</td>
							<td>{developer.public_repos}</td>
						</tr>
						<tr>
							<td>Registered since</td>
							<td>{new Date(developer.created_at).getUTCFullYear()}</td>
						</tr>
						<tr>
							<td>Estimated price (hourly)</td>
							<td>{developer.appAdded.price}$</td>
						</tr>
						<tr>
							<td>Ordered hours</td>
							<td>{developer.appAdded.orderedHours}</td>
						</tr>
					</tbody>
				</table>
				<h4>Cost: {developer.appAdded.totalSum}$</h4>
			</div>
		</div>
	</div>
);
