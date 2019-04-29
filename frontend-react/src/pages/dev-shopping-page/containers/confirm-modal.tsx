import { kea, Dispatcheable } from "kea";
import { get, identity, nthArg, set } from "lodash/fp";
import * as React from "react";
import { put, delay } from "redux-saga/effects";
import * as developerService from "~/src/services/developer";
import handleAjaxError from "~/src/utils/handle-ajax-error";
import {
  IActions as IActionsCart,
  IOrder,
  IReducerState as IReducerStateCart,
  logic as cartLogic
} from "./cart-panel";

const value = nthArg(1);

interface IActions {
  setToken(token: string): string;
  resetToken(): void;
  submitOrder(order: IOrder): IOrder;
}

interface ISelectorState {
  cartSum: number;
}

interface IReducer {
  token: string;
  loading: {
    submitOrder: boolean;
  };
}

const just = val => () => val;

const logic = kea<IActions, IReducer, ISelectorState, any>({
  path: () => ["scenes", "order-modal"],

  connect: {
    actions: [cartLogic, ["resetCart"]],
    props: [get("scenes.cart"), ["order"]]
  },

  actions: () => ({
    submitOrder: identity,
    resetToken: identity,
    setToken: identity
  }),

  reducers: ({ actions }) => ({
    token: ["", { [actions.setToken]: value, [actions.resetToken]: just("") }],
    loading: [
      { submitOrder: false },
      {
        [actions.submitOrder]: set("submitOrder", true),
        [actions.setToken]: set("submitOrder", false)
      }
    ]
  }),

  takeLatest: ({ actions, workers }) => ({
    [actions.submitOrder]: payload => workers.submitOrder(payload, actions)
  }),

  workers: {
    *submitOrder({ payload: order }, { setToken }: Dispatcheable<IActions>) {
      try {
        const response = yield developerService.submitOrder(order);
        yield delay(500);
        yield put(setToken(response.token));
      } catch (error) {
        handleAjaxError(error);
      }
    }
  }
});

const redirect = token => {
  location.href = `${location.pathname.replace(
    "/shopping",
    ""
  )}/show-order?token=${token}`;
};

export const getValue = elem => document.querySelector(elem).value;

export function ConfirmModal({
  token,
  loading,
  order,
  actions
}: IReducer &
  ISelectorState &
  IReducerStateCart & { actions: IActions & Pick<IActionsCart, "resetCart"> }) {
  if (!order) {
    return <React.Fragment />;
  }
  return (
    <div
      id="confirmModal"
      className="modal fade text-center"
      role="dialog"
      aria-labelledby="myModalLabel"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Confirm order</h4>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="modal-body">
            Total price of your order is: {order.cartSum}$
            <p>
              <strong>
                By confirming you get a token to view the progress of your
                order.
                <input
                  id="user-email"
                  className="form-control"
                  placeholder="You get the token per email"
                  type="email"
                  style={{
                    textAlign: "center"
                  }}
                />
              </strong>
            </p>
            <p
              style={{
                display: token ? "inherit" : "none"
              }}
            >
              Your token is: <span id="order-token">{token}</span>. You can now
              close this window.
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-default"
              data-dismiss="modal"
              hidden={Boolean(token)}
            >
              Close
            </button>
            <button
              id="send-order-button"
              type="button"
              hidden={Boolean(token)}
              disabled={!order || loading.submitOrder}
              onClick={() => actions.submitOrder(order)}
              className={`btn btn-success`}
            >
              {loading.submitOrder && (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />
                </>
              )}
              Send order
            </button>

            <button
              id="reset-view-button"
              className="btn btn-secondary"
              data-dismiss="modal"
              hidden={!Boolean(token)}
              onClick={() => {
                actions.resetCart();
                actions.resetToken();
              }}
            >
              Continue with shopping
            </button>

            <button
              id="reset-view-button"
              className="btn btn-primary"
              data-dismiss="modal"
              hidden={!Boolean(token)}
              onClick={() => {
                actions.resetCart();
                actions.resetToken();
                redirect(token);
              }}
            >
              Go to the order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default logic(ConfirmModal);
