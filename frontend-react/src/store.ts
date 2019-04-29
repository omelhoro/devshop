import { getStore } from "kea";
import { createBrowserHistory } from "history";
import sagaPlugin from "kea-saga";
import { reducer as formReducer } from "redux-form";
import { connectRouter, routerMiddleware } from "connected-react-router";

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href")!;
export const history = createBrowserHistory({ basename: baseUrl });

const shouldSaveState = (module as any).hot && localStorage.shouldSaveState;
let initialReduxState;
if (shouldSaveState) {
  initialReduxState = JSON.parse(localStorage.getItem("reduxState") || "{}");
}

const store = getStore({
  middleware: [routerMiddleware(history)],

  preloadedState: initialReduxState,

  plugins: [sagaPlugin],
  reducers: {
    router: connectRouter(history),
    form: formReducer
  }
});

if (shouldSaveState) {
  store.subscribe(() => {
    localStorage.setItem("reduxState", JSON.stringify(store.getState()));
  });
}

export default store;
