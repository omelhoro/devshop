import * as React from 'react';
import { kea } from 'kea';
import { put } from 'redux-saga/effects';
import * as developerService from 'services/developer';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import * as moment from 'moment';
import handleAjaxError from 'utils/handle-ajax-error';
import OrderElement from './show-order-page-components/order-element';

interface IReducerState {
	order: IOrder,
	errorMsg: string
}

interface ISelectorState {
}

interface IActions {
	setOrder(order: IOrder): { order: IOrder },
	getOrder(): any,
	onLoadError(errorMsg: string): { errorMsg: string },

}

interface IWorkers {
	// getOrder: (action) => void,
}

interface IDeveloper {
	login: string,
	appAdded: {
		orderedHours: number,
		totalSum: number,
	}
}

interface IOrder {
	coupon: string,
	cart: IDeveloper[],
	sum: number,
	timestamp: string,
}

const logic = kea<IActions, IReducerState, ISelectorState, IWorkers>({

	path: () => ['scenes', 'show-order'],

	actions: () => ({
		setOrder: order => ({ order }),
		getOrder: () => (0),
		onLoadError: errorMsg => ({ errorMsg }),
	}),

	reducers: ({ actions }) => ({
		order: [
			{
				cart: [], coupon: '', sum: 0, timestamp: '',
			},
			PropTypes.object, {
				[actions.setOrder]: (state, { order }) => order,
			}],
		errorMsg: [
			'',
			PropTypes.string,
			{
				[actions.onLoadError]: (state, { errorMsg }) => errorMsg,
				[actions.setOrder]: (state, payload) => '',
			},
		],
	}),

	* start() {
		console.log('start');
		const { setOrder, onLoadError } = this.actions as IActions;
		const query = queryString.parse(location.search);
		if (query.token) {
			try {
				const response = yield developerService.getOrder(query.token);
				yield put(setOrder(response) as any);
			} catch (error) {
				const msg = yield handleAjaxError(error, false);
				console.log(msg);
				yield put(onLoadError(msg) as any);
			}
		} else {
			yield put(onLoadError('No token found.') as any);
		}
	},

	workers: {

	},
});

type IShowOrderPageProps =
	IReducerState & ISelectorState;

export class ShowOrderPage extends React.Component<IShowOrderPageProps, any> {

	render() {
		return (
			<div>
				{this.props.errorMsg ? (
					<div className="jumbotron bg-danger text-white">
						<h1 className="display-5">Error: {this.props.errorMsg}</h1>
					</div>
				) :
					(
						<div>
							<h2>
								Your order from
								<i>
									{moment(this.props.order.timestamp).format('HH:mm DD-MM-YYYY')}
								</i>
								{' '}
								with a total value of <i>{this.props.order.sum}$</i>
							</h2>
							{(this.props.order.cart).map(developer => (
								<OrderElement
									key={`${developer.login}`}
									developer={developer}
								/>
							))}
						</div>
					)}
			</div>
		);
	}
}

export default logic(ShowOrderPage);
