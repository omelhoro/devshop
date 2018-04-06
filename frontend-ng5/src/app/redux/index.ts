import * as _ from 'lodash';
import { initialShoppingState, IShoppingState } from './initialState';
import selectors, { IShoppingSelectors } from './selectors';
import * as actions from './actions';

/* eslint-disable no-alert */

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
	[actions.ADDHISTORYITEMUSER]: (state, action) => {
		const searchHistoryUser = _.uniq(state.searchHistoryUser.concat(action.item));
		const lastUserSearch = searchHistoryUser[searchHistoryUser.length - 1];
		return ({ ...state, searchHistoryUser, lastUserSearch });
	},
	[actions.ADDHISTORYITEMORG]: (state, action) => {
		const searchHistoryOrg = _.uniq(state.searchHistoryOrg.concat(action.item));
		const lastOrgSearch = searchHistoryOrg[searchHistoryOrg.length - 1];
		return ({ ...state, searchHistoryOrg, lastOrgSearch });
	},
	[actions.LOADINGSTATE]: (state, action) => ({ ...state, loading: action.loading }),
	[actions.ADDTOCARD]: (state, action) => {
		const ixAdd = _.findIndex(state.shoppingCart, (e) => e.login === action.item.login);
		const ixIsInCard = _.findIndex(state.developers, (e) => e.login === action.item.login);
		if (ixIsInCard === -1) {
			return state;
		}

		const developer = { ...state.developers[ixIsInCard], isInCard: true };

		const developers = [
			...state.developers.slice(0, ixIsInCard),
			developer,
			...state.developers.slice(ixIsInCard + 1),
		];

		const shoppingCart = state.shoppingCart.concat(developer);
		const preState = {
			...state,
			shoppingCart,
			developers,
		};
		return ixAdd === -1 ?
			{ ...preState } :
			state;
	},
	[actions.CHANGEPAGE]: (state, action) => {
		const newState = { ...state, currentPage: action.page };
		return newState;
	},
	[actions.SETTOKEN]: (state, action) => {
		return {
			...state,
			token: action.token,
		};
	},
	[actions.CHANGESTATEORDER]: (state, action) => {
		return { ...state, orderStage: action.stage };
	},
	[actions.RESETCARD]: (state, action) => {
		return { ...state, shoppingCart: [], developers: state.developers.map((e) => ({ ...e, isInCard: false })) };
	},
	[actions.SETPRICE]: (state, action) => {
		const ixIsInCard = _.findIndex(state.developers, (e) => e.login === action.item.login);
		const devOld = state.developers[ixIsInCard];
		const devNew = {
			...devOld,
			appAdded: {
				...devOld.appAdded,
				orderedHours: action.value,
				totalSum: action.value * devOld.appAdded.price,
			},
		};

		const developers = [
			...state.developers.slice(0, ixIsInCard),
			devNew,
			...state.developers.slice(ixIsInCard + 1),
		];

		return { ...state, developers };
	},
	[actions.SETSTATE]: (state, action) => {
		return {
			...state,
			...action.state,
		};
	},
	[actions.SKIPCHANGE]: (state) => {
		return state;
	},
	[actions.USECOUPON]: (state, action) => {
		const preState = {
			...state, coupon: action.value,
			discount: action.discount
		};
		return {
			...preState,
		};
	},
	[actions.UPDATENAME]: (state, { name }) => ({ ...state, name }),
	[actions.RESETSTATE]: () => {
		return { ...initialShoppingState };
	},
	[actions.UPDATEPAGESIZE]: (state, action) => ({ ...state, pageSize: action.payload }),
	[actions.SETDEVLIST]: (state, action) => {
		const developers = _.uniqBy(state.developers.concat(action.devs), (e) => e.login);
		const pages = Math.ceil(developers.length / state.devsOnPage);
		const developersPaged = _.chunk(developers, state.devsOnPage);
		return ({ ...state, developers, pages, developersPaged });
	},
	[actions.REMOVEFROMCARD]: (state: IShoppingState, action) => {
		const ixRemove = _.findIndex(state.shoppingCart, (e) => e.login === action.item.login);
		const shoppingCart = [
			...state.shoppingCart.slice(0, ixRemove),
			...state.shoppingCart.slice(ixRemove + 1),
		];

		const ixIsInCard = _.findIndex(state.developers, (e) => e.login === action.item.login);
		const developers = [
			...state.developers.slice(0, ixIsInCard),
			{ ...state.developers[ixIsInCard], isInCard: false },
			...state.developers.slice(ixIsInCard + 1),
		];

		const preState = {
			...state,
			shoppingCart,
			developers,
		};
		return {
			...preState,
		};
	},
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function reducer(state = initialShoppingState, action = { type: undefined }) {
	const fn = ACTION_HANDLERS[action.type];
	const newState = fn ? fn(state, action) : state;
	const newStateCalculated = { ...newState, ...selectors(newState) };
	localStorage.redux = JSON.stringify(newStateCalculated);
	return newStateCalculated;
}
