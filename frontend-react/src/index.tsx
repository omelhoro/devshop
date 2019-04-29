import * as React from "react";
import * as ReactDOM from "react-dom";
import "jquery";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/site.css";
import store, { history } from "./store";
import App from "./app";

const renderApp = () => {
  const app = <App store={store} history={history} />;
  document.getElementById("loader").style.display = "none";
  document.getElementById("react-root").style.display = "block";
  ReactDOM.render(app, document.getElementById("react-root"));
};

renderApp();

module.hot.accept(renderApp);
