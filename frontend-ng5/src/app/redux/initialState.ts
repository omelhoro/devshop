import { IShoppingSelectors } from './selectors';

export interface IShoppingState {
	discount: number;
	pageSize: number;
	currentPage: number;

	token: string;
	coupon: string;

	loading: false;

	searchHistoryOrg: any[];
	searchHistoryUser: any[];
	developers: IDeveloper[];
	shoppingCart: IDeveloper[];
	orderStage: 'choosing';
	lastUserSearch: '';
	lastOrgSearch: '';
}

export interface IDeveloper {
	login: string;
	appAdded: {
		orderedHours: number;
		totalSum: number;
	};
}

export type IShoppingStore = IShoppingState & IShoppingSelectors;

export const initialShoppingState: IShoppingState = {

	discount: 0,
	pageSize: 6,
	currentPage: 0,

	token: '',
	coupon: '',

	loading: false,

	searchHistoryOrg: [],
	searchHistoryUser: [],
	developers: [],
	shoppingCart: [],
	orderStage: 'choosing',
	lastUserSearch: '',
	lastOrgSearch: '',
};
