import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import invariant from 'redux-immutable-state-invariant';

import rootReducer from './index';
import immutable from 'immutable';

import { initialShoppingState } from './initialState';

const initStateSaved = JSON.parse(localStorage['redux'] || '{}');

// const combinedState = immutable.fromJS({...initState, ...initStateSaved});
const combinedState = { ...initialShoppingState, ...initStateSaved };

export default function configureStore(initialState = combinedState) {
	const store = createStore(rootReducer, initialState, compose(
		applyMiddleware(invariant(), thunk),
		(window as any).devToolsExtension ? (window as any).devToolsExtension() : f => f
	));

	if (module.hot) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept('./index', () => {
			const nextReducer = require('./index');
			store.replaceReducer(nextReducer);
		});
	}

	return store;
}
