import * as React from "react";
import { Provider } from "react-redux";
import { Store } from "redux";
import { ConnectedRouter } from "connected-react-router";
import { Route, Switch } from "react-router-dom";
import { History } from "history";

import HomePage from "./pages/home-page";
import Layout from "./pages/layout";
import ShowOrderPage from "./pages/show-order-page/index";
import DevShoppingPage from "./pages/dev-shopping-page/index";

interface IProps {
  store: Store<any>;
  history: History;
}

function App({ store, history }: IProps) {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Layout>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/show-order" component={ShowOrderPage} />
            <Route exact path="/shopping" component={DevShoppingPage} />
          </Switch>
        </Layout>
      </ConnectedRouter>
    </Provider>
  );
}

export default App;
