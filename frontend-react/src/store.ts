import { routerReducer, routerMiddleware } from 'react-router-redux';
import { getStore } from 'kea';
import { createBrowserHistory } from 'history';
import sagaPlugin from 'kea-saga';
import { reducer as formReducer } from 'redux-form';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')!;
export const history = createBrowserHistory({ basename: baseUrl });


if ((module as any).hot && localStorage.shouldSaveState) {
	const initialStateLocalStorage =
		localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : '';
	if (initialStateLocalStorage)
		(window as any).initialReduxState = initialStateLocalStorage;
}
const initialState = ((window as any).initialReduxState);

const store = getStore({
	middleware: [
		routerMiddleware(history),
	],

	preloadedState: initialState || undefined,

	plugins: [sagaPlugin],
	reducers: {
		router: routerReducer,
		form: formReducer,
	},
});

if ((module as any).hot && localStorage.shouldSaveState) {
	store.subscribe(() => {
		localStorage.setItem('reduxState', JSON.stringify(store.getState()));
	});
}

export default store;
