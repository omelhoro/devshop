import * as React from 'react';
import SearchPanel from 'pages/dev-shopping-page-components/search-panel';
import { kea } from 'kea';
import { put } from 'redux-saga/effects';
import * as developerService from 'services/developer';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import handleAjaxError from 'utils/handle-ajax-error';
import ListElement from './dev-shopping-page-components/dev-list-entry';
import CartElement from './dev-shopping-page-components/cart-list-entry';
import ConfirmModal from './dev-shopping-page-components/confirm-modal';

interface IReducerState {
	developers: IDeveloper[],
	developersInCart: IDeveloper[],
	resultsLoading: boolean,
	currentPage: number,
	coupon: string,
	token: string,
}

interface IActions {
	findDeveloperByName(name: string): { name: string },
	findDeveloperByOrgName(name: string): { name: string },

	addDevelopersToList(dev: IDeveloper | IDeveloper[]): { dev: IDeveloper | IDeveloper[] },
	addDevelopersToCart(dev: IDeveloper): { dev: IDeveloper },

	changeDevHours(developer: IDeveloper, hours): { developer, hours },
	removeFromCart(developer: IDeveloper): { developer }
	changePage(page): { page },
	onCouponChange(coupon): { coupon },
	submitOrder(cart: IDeveloper[], coupon: string, email): ({ cart, coupon, email }),
	setToken(token: string): { token: string },
	resetCart(): any,
	onAjaxError(errorMsg): { errorMsg: string },
}

interface IWorkers {
	findDeveloperByName: (action: { payload: ReturnType<IActions['findDeveloperByName']> }) => void,
	findDeveloperByOrgName: (action: { payload: ReturnType<IActions['findDeveloperByOrgName']> }) => void,
	submitOrder: (action: { payload: ReturnType<IActions['submitOrder']> }) => void
}

interface ISelectorState {
	cartSum: number,
	devsInCartMap: {},
	pagedDevList: IDeveloper[][],
}

interface IDeveloper {
	login: string,
	appAdded: {
		orderedHours: number,
		totalSum: number,
	}
}

const logic = kea<IActions, IReducerState, ISelectorState, IWorkers>({
	path: () => ['scenes', 'shopping-page'],

	actions: () => ({
		findDeveloperByName: name => ({ name }),
		findDeveloperByOrgName: name => ({ name }),
		addDevelopersToList: (dev: IDeveloper | IDeveloper[]) => ({ dev }),
		addDevelopersToCart: (dev: IDeveloper) => ({ dev: { ...dev, addedToCart: new Date() } }),
		changeDevHours: (developer: IDeveloper, hours) => ({ developer, hours }),
		removeFromCart: (developer: IDeveloper) => ({ developer }),
		changePage: (page: number) => ({ page }),
		onCouponChange: (coupon: string) => ({ coupon }),
		submitOrder: (cart, coupon, email) => ({ cart, coupon, email }),
		setToken: token => ({ token }),
		resetCart: () => (0),
		onAjaxError: errorMsg => ({ errorMsg }),
	}),

	reducers: ({ actions }) => ({
		developers: [[], PropTypes.array, {

			[actions.addDevelopersToList]:
				(state, payload) =>
					_.uniqBy([].concat(payload.dev).concat(state), 'login'),

			[actions.changeDevHours]: (state, { developer, hours }) => {
				const index = state.findIndex(item => item.login === developer.login);
				const newDev = {
					...developer,
					appAdded: {
						...developer.appAdded,
						orderedHours: hours,
						totalSum: hours * developer.appAdded.price,
					},
				};
				return state.slice(0, index).concat(newDev).concat(state.slice(index + 1));

			},
		}],
		token: ['', PropTypes.string, {

			[actions.setToken]: (state, payload) => payload.token,

			[actions.resetCart]: (state, payload) => '',

		}],
		coupon: ['', PropTypes.string, {

			[actions.onCouponChange]: (state, { coupon }) => coupon,

			[actions.resetCart]: (state, payload) => '',

		}],
		currentPage: [0, PropTypes.number, {

			[actions.changePage]: (state, { page }) => page,

		}],
		developersInCart: [[], PropTypes.array, {

			[actions.removeFromCart]: (state, { developer }) =>
				state.filter(elem => elem.login !== developer.login),

			[actions.resetCart]: (state, payload) => [],

			[actions.addDevelopersToCart]:
				(state, payload) =>
					_.uniqBy(state.concat(payload.dev), 'login'),

		}],
		resultsLoading: [false, PropTypes.boolean, {

			[actions.addDevelopersToList]: () => false,

			[actions.findDeveloperByName]: () => true,

			[actions.findDeveloperByOrgName]: () => true,

			[actions.onAjaxError]: () => false,

		}],
	}),

	selectors: ({ selectors }) => ({
		cartSum: [
			() => [selectors.developersInCart, selectors.coupon],
			(developersInCart: any[], coupon: string) => {
				const sum = developersInCart.reduce((agg, curr) => curr.appAdded.totalSum + agg, 0);
				if (sum && coupon === 'SHIPIT') {
					return Math.ceil(sum - (sum * 0.1));
				} else {
					return sum;
				}
			},
			PropTypes.number,
		],
		devsInCartMap: [
			() => [selectors.developersInCart],
			(developersInCart: IDeveloper[]) => developersInCart.reduce((agg, curr) => {
				agg[curr.login] = curr;
				return agg;
			}, {}),
			PropTypes.object,
		],
		pagedDevList: [
			() => [selectors.developers],
			(developers: IDeveloper[]) => {
				return _.chunk(developers, 7);
			},
			PropTypes.array,
		],
	}),

	takeLatest: ({ actions, workers }) => ({
		[actions.findDeveloperByName]: action => workers.findDeveloperByName(action),
		[actions.findDeveloperByOrgName]: action => workers.findDeveloperByOrgName(action),
		[actions.submitOrder]: action => workers.submitOrder(action),
	}),

	workers: {

		* submitOrder(action) {
			const { cart, coupon, email } = action.payload;
			const { setToken } = (this.actions as IActions);
			try {
				const response = yield developerService.submitOrder({ cart, coupon, email });
				yield put(setToken(response.token) as any);
			} catch (error) {
				handleAjaxError(error);
			}

		},

		* findDeveloperByName({ payload }) {
			const { name } = payload;
			const { addDevelopersToList, onAjaxError } = (this.actions as IActions);
			try {
				const developer = yield developerService.findByName(name);
				yield put(addDevelopersToList(developer) as any);
			} catch (error) {
				const msg = yield handleAjaxError(error);
				yield put(onAjaxError(msg) as any);
			}
		},
		* findDeveloperByOrgName({ payload }) {
			const { name } = payload;
			const { addDevelopersToList, onAjaxError } = (this.actions as IActions);
			try {
				const developer = yield developerService.findByOrgName(name);
				yield put(addDevelopersToList(developer) as any);
			} catch (error) {
				const msg = yield handleAjaxError(error);
				yield put(onAjaxError(msg) as any);
			}
		},
	},

});

/* eslint-disable */
export const Pagination = ({ pages, currentPage, onPageChange }) => (
	<ul
		className="pagination justify-content-center"
		hidden={!pages}
		style={{
			margin: '0 auto',
			marginBottom: 10,
		}}
	>
		<li className="page-item">
			<div className="page-link" aria-label="Previous" onClick={() => currentPage > 0 ? onPageChange(currentPage - 1) : 0}>
				<span aria-hidden="true">&laquo;</span>
			</div>
		</li>
		{_.range(pages).map((page, i) => (
			<li
				key={`page-${i}`}
				onKeyPress={() => onPageChange(i)}
				onClick={() => onPageChange(i)}
				className={`${i === currentPage ? 'active' : ''} page-item`}
			>
				<div className="page-link">{i + 1}</div>
			</li>
		))}
		<li className="page-item">
			<div aria-label="Next" className="page-link" onClick={() => currentPage < (pages - 1) ? onPageChange(currentPage + 1) : 0}>
				<span aria-hidden="true">&raquo;</span>
			</div>
		</li>
	</ul >
);

/* eslint-enable */


type IDevShoppingPageProps =
	IReducerState &
	ISelectorState;

export class DevShoppingPage extends React.Component<IDevShoppingPageProps, any> {

	actions: IActions;

	render() {

		return (
			<div className="centerCol">
				<ConfirmModal
					token={this.props.token}
					cartSum={this.props.cartSum}
					resetCart={() => this.actions.resetCart()}
					submitOrder={email =>
						this.actions.submitOrder(
							this.props.developersInCart,
							this.props.coupon, email
						)}
				/>
				<div style={{
					margin: '0px auto',
					marginBottom: '20px',
					display: 'block',
				}}
				>
					<SearchPanel
						addDevFromName={name => this.actions.findDeveloperByName(name)}
						addDevFromOrgName={name => this.actions.findDeveloperByOrgName(name)}
						developers={this.props.developers}
						resultsLoading={this.props.resultsLoading}
					/>

				</div>

				<div className="row">

					<div id="developers-list" className="col-sm-8">
						<div>
							<Pagination
								pages={this.props.pagedDevList.length}
								currentPage={this.props.currentPage}
								onPageChange={page => this.actions.changePage(page)}
							/>
						</div>

						{this.props.developers.length ? (this.props
							.pagedDevList[this.props.currentPage]
							.map((developer, index) =>
								(<ListElement
									key={`developer-entry-${developer.login}`}
									onHoursChange={evt =>
										this.actions.changeDevHours(developer, Number(evt.target.value))
									}
									addDevelopersToCart={() =>
										this.actions.addDevelopersToCart(developer)}
									removeFromCart={() => this.actions.removeFromCart(developer)}
									element={developer}
									isInCart={this.props.devsInCartMap[developer.login]}
								/>))) :
							(
								<div className="jumbotron">
									<h1 className="display-4">No developers found</h1>
								</div>
							)
						}

						<div>
							<Pagination
								pages={this.props.pagedDevList.length}
								currentPage={this.props.currentPage}
								onPageChange={page => this.actions.changePage(page)}
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
										{this.props
											.developersInCart.length ? (this.props
												.developersInCart
												.map((developer, index) => (<CartElement
													key={`${developer.login}`}
													element={developer}
													removeFromCart={() => this.actions.removeFromCart(developer)}
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
											value={this.props.coupon}
											onChange={evt => this.actions.onCouponChange(evt.target.value)}
											className="form-control"
											type="text"
										/>
									</div>
									<div className="text-center">
										<h4>
											{this.props.cartSum}$
										</h4>
									</div>
									<button
										id="open-modal-confirm"
										data-toggle="modal"
										disabled={!this.props.cartSum}
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
	}
}

export default logic(DevShoppingPage);
