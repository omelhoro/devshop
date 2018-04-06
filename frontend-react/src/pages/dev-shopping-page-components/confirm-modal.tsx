import * as React from 'react';

const redirect = (token) => {
	location.href = `${location.origin}/show-order?token=${token}`;
};

export const getValue = (elem) => document
	.querySelector(elem)
	.value;

export default ({
	cartSum, submitOrder, token, resetCart,
}) =>
	(
		<div
			id="confirmModal"
			className="modal fade text-center"
			role="dialog"
			aria-labelledby="myModalLabel"
		>
			<div className="modal-dialog">
				<div className="modal-content">

					<div className="modal-header">
						<h4 className="modal-title">Confirm order</h4>
						<button type="button" className="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>

					<div className="modal-body">
						Total price of your order is: {cartSum}$
						<p>
							<strong>
								By confirming you get a token to view the progress of your order.
								<input
									id="user-email"
									className="form-control"
									placeholder="You get the token per email"
									type="email"
									style={{
										textAlign: 'center',
									}}
								/>
							</strong>
						</p>

						<p
							style={{
								display: token ? 'inherit' : 'none',
							}}
						>
							Your token is: <span id="order-token">{token}</span>. You can now close this window.
						</p>
					</div>
					<div className="modal-footer">

						<button
							type="button"
							className="btn btn-default"
							data-dismiss="modal"
							hidden={token}
						>
							Close
						</button>
						<button
							id="send-order-button"
							type="button"
							hidden={token}
							onClick={() => submitOrder(getValue('#user-email'))}
							className="btn btn-success"
						>
							Send order
						</button>

						<button
							id="reset-view-button"
							className="btn btn-secondary"
							data-dismiss="modal"
							hidden={!token}
							onClick={() => resetCart()}
						>
							Continue with shopping
						</button>

						<button
							id="reset-view-button"
							className="btn btn-primary"
							data-dismiss="modal"
							hidden={!token}
							onClick={() => redirect(token)}
						>
							Go to the order
						</button>

					</div>
				</div>
			</div>
		</div>
	);
