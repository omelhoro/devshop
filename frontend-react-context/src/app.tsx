import * as React from 'react';
import { Route, Router } from 'react-router-dom';

import HomePage from 'pages/home-page';
import Layout from './pages/layout';
import DevShoppingPage from './pages/dev-shopping-page';
import ShowOrderPage from './pages/show-order-page';
import { AppProvider, Provider } from './store-provider';

class App extends AppProvider {
	render() {
		return (
			<Provider value={this.state}>
				<Router history={this.props.history}>
					<Layout>
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
				</Router>
			</Provider>
		);
	}
}

// tslint:disable-next-line
export default module.hot ? require('react-hot-loader').hot(module)(App) : App;
