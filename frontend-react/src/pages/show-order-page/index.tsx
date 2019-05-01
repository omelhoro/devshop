import { Dispatcheable, kea } from "kea";
import { identity } from "lodash/fp";
import moment from "moment";
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

export interface IDeveloperOrder {
  developer: {
    login: string;
    avatar_url: string;
    followers: number;
    public_gists: number;
    public_repos: number;
    created_at: number;
    appAdded: {
      price: number;
    };
  };
  orderInfo: {
    hours: number;
    totalPrice: number;
    addedToCart: string;
  };
}

interface IOrder {
  coupon: string;
  cart: IDeveloperOrder[];
  cartSum: number;
  timestamp: string;
}

const just = (val?) => (state, _val) => (val === undefined ? _val : val);

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
        totalSum: 0,
        coupon: "",
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
            Your order from{" "}
            <i>{moment(order.timestamp).format("HH:mm DD-MM-YYYY")}</i> with a
            total value of <i>{order.cartSum}$</i>
          </h2>
          {order.cart.map(developerOrder => (
            <OrderElement
              key={`${developerOrder.developer}`}
              developerOrder={developerOrder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default logic(ShowOrderPage);
