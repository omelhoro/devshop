import * as React from 'react';
// import * as developerService from 'services/developer';
import * as _ from 'lodash';
import { createSelector } from 'reselect';
import SearchPanel from './search-panel';
import ListElement from './dev-list-entry';
import CartElement from './cart-list-entry';
import ConfirmModal from './confirm-modal';
import Pagination from './pagination';
import { Consumer, IContext } from '../../store-provider';

const paginateListFn = createSelector(
	_.identity,
	(val: any[]) => _.chunk(val, 7));

const devsInCartMapFn = createSelector(
	_.identity,
	(val: any[]) => val.reduce((acc, item) => ({ ...acc, [item.login]: true }), {}));

const cartSumFn = createSelector(
	(context: IContext) => context.developersInCart,
	(context: IContext) => context.coupon,
	(devs: any[], coupon) => {
		const sum = devs.reduce((agg, item) => agg + item.appAdded.totalSum, 0);
		if (coupon === 'SHIPIT') {
			return sum - (sum * 0.1);
		} else {
			return sum;
		}
	}
);

export default () => (
	<Consumer>
		{(context: IContext) => {
			const pagedDevList = paginateListFn(context.developers);
			const devsInCartMap = devsInCartMapFn(context.developersInCart);
			const cartSum = cartSumFn(context);
			return (
				<div className="centerCol">
					<ConfirmModal
						cartSum={cartSum}
					/>
					<div style={{
						margin: '0px auto',
						marginBottom: '20px',
						display: 'block',
					}}
					>
						<SearchPanel
							onDevResult={(data) => context.actions.addDevelopers([].concat(data))}
						/>
					</div>

					<div className="row">

						<div id="developers-list" className="col-sm-8">
							<div>
								<Pagination
									pages={pagedDevList.length}
									currentPage={context.currentPage}
									onPageChange={(page) => context.actions.changePage(page)}
								/>
							</div>

							{context.developers.length ? (
								pagedDevList[context.currentPage]
									.map((developer) =>
										(<ListElement
											key={`developer-entry-${developer.login}`}
											onHoursChange={(evt) =>
												context.actions.changeDevHours(developer, Number(evt.target.value))
											}
											addDevelopersToCart={() =>
												context.actions.addDevToCart(developer)}
											removeFromCart={() => context.actions.removeFromCart(developer)}
											element={developer}
											isInCart={devsInCartMap[(developer as any).login]}
										/>))) :
								(
									<div className="jumbotron">
										<h1 className="display-4">No developers found</h1>
									</div>
								)
							}

							<div>
								<Pagination
									pages={pagedDevList.length}
									currentPage={context.currentPage}
									onPageChange={(page) => context.actions.changePage(page)}
								/>
							</div>

						</div>

						<div className="col-sm-4">
							<div
								className="panel panel-primary sticky-top"
							>
								<div className="panel-heading">
									<h3 className="panel-title">Shopping cart</h3>
								</div>
								<div className="panel-body">
									<div >
										<ul className="list-group">
											{context
												.developersInCart.length ? (context
													.developersInCart
													.map((developer) => (
														<CartElement
															key={`${developer.login}`}
															element={developer}
															removeFromCart={() => context.actions.removeFromCart(developer)}
														/>))) : (
													<i className="material-icons md-48" style={{ margin: '0px auto' }}>
														shopping_cart
														</i>
												)}
										</ul>
										<div
											className="input-group mb-3"
											style={{
												marginTop: '20px',
											}}
										>
											<div className="input-group-prepend">
												<span
													className="input-group-text"
												>
													Coupon
													</span>
											</div>
											<input
												id="coupon-entry"
												placeholder="e.g. SHIPIT"
												value={context.coupon}
												onChange={(evt) => context.actions.onCouponChange(evt.target.value)}
												className="form-control"
												type="text"
											/>
										</div>
										<div className="text-center">
											<h4>
												{cartSum}$
												</h4>
										</div>
										<button
											id="open-modal-confirm"
											data-toggle="modal"
											disabled={!cartSum}
											data-target="#confirmModal"
											className="btn btn-block btn-info"
										>
											Order
											</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}}
	</Consumer>
);
