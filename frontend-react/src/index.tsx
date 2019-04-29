import * as React from "react";
import * as ReactDOM from "react-dom";
import "jquery";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/site.css";
import store, { history } from "./store";
import App from "./app";

const renderRoot = (app: JSX.Element) => {
  document.getElementById("loader").style.display = "none";
  document.getElementById("react-root").style.display = "block";
  ReactDOM.render(app, document.getElementById("react-root"));
};

renderRoot(<App store={store} history={history} />);
