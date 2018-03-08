import { Injectable } from '@angular/core';

export interface InternalStateType {
	[key: string]: any;
}

// @Injectable()
// export class AppState {
//
// 	public _state: InternalStateType = {
// 		discount: 0,
// 		sum: 0,
// 		devsOnPage: 5,
// 		currentPage: 0,
// 		pages: 1,
//
// 		token: '',
// 		coupon: '',
// 		timestamp: '',
//
// 		loading: false,
//
// 		searchHistoryOrg: [],
// 		searchHistoryUser: [],
// 		developers: [],
// 		shoppingcard: [],
// 		organizations: [],
// 		orderStage: 'choosing',
// 		lastUserSearch: '',
// 		lastOrgSearch: '',
// 	};
//
// 	/**
// 	 * Already return a clone of the current state.
// 	 */
// 	public get state() {
// 		return this._state = this._clone(this._state);
// 	}
// 	/**
// 	 * Never allow mutation
// 	 */
// 	public set state(value) {
// 		throw new Error('do not mutate the `.state` directly');
// 	}
//
// 	public get(prop?: any) {
// 		/*
// 		 * Use our state getter for the clone.
// 		 */
// 		const state = this.state;
// 		return state.hasOwnProperty(prop) ? state[prop] : state;
// 	}
//
// 	public set(prop: string, value: any) {
// 		/**
// 		 * Internally mutate our state.
// 		 */
// 		return this._state[prop] = value;
// 	}
//
// 	private _clone(object: InternalStateType) {
// 		/**
// 		 * Simple object clone.
// 		 */
// 		return JSON.parse(JSON.stringify(object));
// 	}
// }

import { HmrState } from 'angular2-hmr';
import { bindActionCreators } from 'redux';
import { IShoppingStore } from './redux/initialState';
import store from './redux/configureStore';
import reducer from './redux';
import * as actions from './redux/action-creators';

// const store = require('./redux/configureStore').default;
// const actions = require('./redux/index');

@Injectable()
export class AppState {
	// @HmrState() is used by HMR to track the state of any object during a hot module replacement
	public store;
	public _state: any;
	public actions: typeof actions;


	constructor() {
		this.store = store();
		this.actions = bindActionCreators(actions, this.store.dispatch);
	}

	// already return a clone of the current state
	get state(): IShoppingStore {
		return this.store.getState();
		// return this._state = this._clone(this.store.getState());
	}
	// never allow mutation
	set state(value) {
		throw new Error('do not mutate the `.state` directly');
	}

	get(prop?: any) {
		// use our state getter for the clone
		const state = this.state;
		return state[prop] || state;
	}

	set(prop: string, value: any) {
		// internally mutate our state
		// return this._state[prop] = value;
	}

	_clone(object) {
		// simple object clone
		return JSON.parse(JSON.stringify(object));
	}
}
