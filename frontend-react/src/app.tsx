import * as React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { ConnectedRouter } from 'react-router-redux';
import { Route } from 'react-router-dom';
import { History } from 'history';

import CounterPage from 'pages/counter-page';
import HomePage from 'pages/home-page';
import Layout from 'pages/layout';
import DevShoppingPage from 'pages/dev-shopping-page';
import ShowOrderPage from 'pages/show-order-page';

interface Props {
	store: Store<any>;
	history: History;
}

class App extends React.Component<Props, {}> {
	render() {
		// const { store, history } = this.props;
		return (
			<Provider store={this.props.store}>
				<ConnectedRouter history={this.props.history}>
					<Layout>
						<Route
							exact
							path="/counter"
							component={CounterPage}
						/>
						<Route
							exact
							path="/"
							component={HomePage}
						/>
						<Route
							exact
							path="/show-order"
							component={ShowOrderPage}
						/>

						<Route
							exact
							path="/shopping"
							component={DevShoppingPage}
						/>

					</Layout>
				</ConnectedRouter>
			</Provider>
		);
	}
}

export default module.hot ? require('react-hot-loader').hot(module)(App) : App;
