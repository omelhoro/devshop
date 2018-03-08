import { createSelector } from 'reselect';
import * as _ from 'lodash';
import { IShoppingState, IDeveloper } from './initialState';

const developersPagedSelector = createSelector(
	(state: IShoppingState) => state.developers,
	(state) => state.pageSize,
	(developers, pageSize) => _.chunk(developers, pageSize)
);

const cartSumSelector = createSelector(
	(state: IShoppingState) => state.shoppingCart,
	(state: IShoppingState) => state.discount,
	(shoppingCart, discount) => {
		const startSum = shoppingCart.reduce((agg, curr) => agg + curr.appAdded.totalSum, 0);
		let sum = 0;
		if (discount) {
			const sumCoupon = (1 - (discount / 100)) * startSum;
			sum = sumCoupon;
		} else {
			sum = startSum;
		}
		return sum;
	}
);

export interface IShoppingSelectors {
	developersPaged: IDeveloper[];
	sum: number;
}

export default (state): IShoppingSelectors => ({
	developersPaged: developersPagedSelector(state),
	sum: cartSumSelector(state),
});
