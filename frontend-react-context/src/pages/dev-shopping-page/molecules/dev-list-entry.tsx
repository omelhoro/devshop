import * as React from 'react';
import DevImage from './atoms/dev-image';
export default ({
	element, addDevelopersToCart, onHoursChange, isInCart, removeFromCart,
}) => {

	return (
		<div
			className="card developer-entry"
			id={`${element.login}-data`}
			style={{
				padding: '10px',
				marginBottom: '20px',
			}}
		>
			<div className="media" style={{
				flexWrap: 'wrap'
			}}>
				<div className="media-left media-top">
					<div>
						<DevImage
							src={element.avatar_url}
							alt={element.login}
						/>
					</div>
				</div>
				<div className="media-body">
					<h4 className="media-heading">
						{element.login}
					</h4>

					<table className="table table-bordered table-hovered">
						<tbody>

							<tr>
								<td>Followers</td>
								<td>{element.followers}</td>
							</tr>
							<tr>
								<td>Gists</td>
								<td>{element.public_gists}</td>
							</tr>
							<tr>
								<td>Repos</td>
								<td>{element.public_repos}</td>
							</tr>
							<tr>
								<td>Registered since</td>
								<td>{new Date(element.created_at).getUTCFullYear()}</td>
							</tr>
							<tr>
								<td>Estimated price (hourly)</td>
								<td><span className="price">{element.appAdded.price}</span>$</td>
							</tr>
							<tr>
								<td>Ordered hours</td>
								<td>
									<input
										className="form-control hours"
										value={element.appAdded.orderedHours}
										disabled={isInCart}
										onChange={onHoursChange}
										min={0}
										type="number"
									/>
								</td>
							</tr>
						</tbody>
					</table>

					<div className="">
						<button
							disabled={!element.appAdded.orderedHours}
							hidden={isInCart}
							className="btn btn-block btn-success add-to-card"
							onClick={addDevelopersToCart}
						>
							Add {element.login} to cart for {element.appAdded.totalSum}$
						</button>
						<button
							className="btn btn-block btn-warning"
							hidden={!isInCart}
							onClick={removeFromCart}
						>Remove from cart
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
