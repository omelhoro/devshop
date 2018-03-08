import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'css/site.css';
// import store, { history as browserHistory } from './store';
import store, { history } from 'store';
import App from 'app';

const renderRoot = (app: JSX.Element) => {
	document.getElementById('loader').style.display = 'none';
	document.getElementById('react-root').style.display = 'block';
	ReactDOM.render(app, document.getElementById('react-root'));
};

renderRoot((
	<App store={store} history={history} />
));

// if (process.env.NODE_ENV === 'production') {
// } else { // removed in production, hot-reload config
// tslint:disable-next-line:no-var-requires
// const AppContainer = require('react-hot-loader').AppContainer;
// renderRoot((
// 	<App store={store} history={history} />
// ));

// if ((module as WebPackModuleLoader).hot) {
// 	// app
// 	(module as WebPackModuleLoader).hot.accept('./app', async () => {
// 		// const NextApp = require('./app').App;
// 		// let store, { history } = require('./store');
// 		const NextApp = (await require('./app')).App;
// 		renderRoot((
// 			<NextApp store={store} history={history} />
// 		));
// 	});
// }
// }
