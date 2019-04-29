import { Dispatcheable, kea } from "kea";
import { identity } from "lodash/fp";
import * as moment from "moment";
import * as queryString from "query-string";
import * as React from "react";
import { put } from "redux-saga/effects";
import * as developerService from "~/src/services/developer";
import handleAjaxError from "~/src/utils/handle-ajax-error";
import OrderElement from "./containers/order-element";

interface IReducerState {
  order: IOrder;
  errorMsg: string;
}

interface IActions {
  setOrder(order: IOrder): { order: IOrder };
  onLoadError(errorMsg: string): { errorMsg: string };
}

interface IDeveloper {
  login: string;
  appAdded: {
    orderedHours: number;
    totalSum: number;
  };
}

interface IOrder {
  coupon: string;
  cart: IDeveloper[];
  sum: number;
  timestamp: string;
}

const just = (val?) => (state, _val) => val || _val;

const logic = kea<IActions, IReducerState, {}, {}>({
  path: () => ["scenes", "show-order"],

  actions: () => ({
    setOrder: identity,
    onLoadError: identity
  }),

  reducers: ({ actions }) => ({
    order: [
      {
        cart: [],
        coupon: "",
        sum: 0,
        timestamp: ""
      },
      {
        [actions.setOrder]: just()
      }
    ],
    errorMsg: [
      "",
      {
        [actions.onLoadError]: just(),
        [actions.setOrder]: just("")
      }
    ]
  }),

  *start() {
    console.log("start");
    const { setOrder, onLoadError } = this.actions as Dispatcheable<IActions>;
    const query = queryString.parse(location.search);
    if (query.token) {
      try {
        const response = yield developerService.getOrder(query.token);
        yield put(setOrder(response));
      } catch (error) {
        const msg = yield handleAjaxError(error, false);
        yield put(onLoadError(msg));
      }
    } else {
      yield put(onLoadError("No token found."));
    }
  },

  workers: {}
});

type IShowOrderPageProps = IReducerState & {};

function ShowOrderPage({ errorMsg, order }: IShowOrderPageProps) {
  return (
    <div>
      {errorMsg ? (
        <div className="jumbotron bg-danger text-white">
          <h1 className="display-5">Error: {errorMsg}</h1>
        </div>
      ) : (
        <div>
          <h2>
            Your order from
            <i>{moment(order.timestamp).format("HH:mm DD-MM-YYYY")}</i> with a
            total value of <i>{order.sum}$</i>
          </h2>
          {order.cart.map(developer => (
            <OrderElement key={`${developer.login}`} developer={developer} />
          ))}
        </div>
      )}
    </div>
  );
}

export default logic(ShowOrderPage);
