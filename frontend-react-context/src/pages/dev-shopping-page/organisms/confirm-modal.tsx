import * as React from 'react';
import { Fetch } from 'react-request';
import Composer from 'react-composer';
import url from '../../../utils/url';
import { Consumer, IContext } from '../../../store-provider';
import { cartSumFn } from '../organisms/cart-panel';

const redirect = (token) => {
	location.href = `${location.pathname.replace('/shopping', '')}/show-order?token=${token}`;
};

export const getValue = (elem) => document
	.querySelector(elem)
	.value;

export default () => (
	<Composer components={[
		<Consumer children={[] as any} />,
		({ results: [context], render }: { results: [IContext], render: any }) =>
			<Fetch method="POST"
				children={render}
				headers={{ 'Content-Type': 'application/json' }}
				url={url('orders')}
				afterFetch={({ data }) => context.actions.setToken(data.token)}
			/>
	]}>
		{([context, { doFetch: postOrder }]: [IContext, any]) => {
			const cartSum = cartSumFn(context);
			return (
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
										display: context.token ? 'inherit' : 'none',
									}}
								>
									Your token is: <span id="order-token">{context.token}</span>. You can now close this window.
						</p>
							</div>
							<div className="modal-footer">

								<button
									type="button"
									className="btn btn-default"
									data-dismiss="modal"
									hidden={Boolean(context.token)}
								>
									Close
								</button>
								<button
									id="send-order-button"
									type="button"
									hidden={Boolean(context.token)}
									onClick={() => postOrder({
										body: JSON.stringify({
											email: getValue('#user-email'),
											coupon: context.coupon,
											cart: context.developersInCart,
										})
									})}
									className="btn btn-success"
								>
									Send order
								</button>

								<button
									id="reset-view-button"
									className="btn btn-secondary"
									data-dismiss="modal"
									hidden={!Boolean(context.token)}
									onClick={() => context.actions.resetCart()}
								>
									Continue with shopping
								</button>

								<button
									id="reset-view-button"
									className="btn btn-primary"
									data-dismiss="modal"
									hidden={!Boolean(context.token)}
									onClick={() => {
										context.actions.resetCart();
										context.actions.setToken('');
										redirect(context.token);
									}}
								>
									Go to the order
								</button>

							</div>
						</div>
					</div>
				</div>
			);
		}}
	</Composer>
);
