import { kea } from "kea";
import { identity, reject, sumBy, uniqBy } from "lodash/fp";
import * as React from "react";
import CartElement from "../components/cart-list-entry";

export interface IReducerState {
  developersInCart: ICartDeveloper[];
  order: IOrder;
  coupon: string;
}

export interface IOrder {
  email?: string;
  coupon: string;
  cart: any[];
  cartSum: number;
}

const just = (val?) => (state, _val) => val || _val;

export interface IActions {
  addDeveloperToCart(developer: IDeveloper, orderInfo: any): ICartDeveloper;
  removeFromCart(developer: IDeveloper): IDeveloper;
  resetCart(): [];

  setOrder(order: IOrder): IOrder;

  onCouponChange(coupon: string): string;
  onAjaxError(errorMsg: string): string;
}

interface ISelectorState {
  cartSum: number;
}

interface IDeveloper {
  login: string;
}

export interface ICartDeveloper {
  developer: IDeveloper;
  orderInfo: { totalPrice: number; hours: number; addedToCart?: Date };
}

export const logic = kea<IActions, IReducerState, ISelectorState, {}>({
  path: () => ["scenes", "cart"],

  actions: () => ({
    addDeveloperToCart: (developer, orderInfo) => ({
      developer,
      orderInfo: { ...orderInfo, addedToCart: new Date() }
    }),
    removeFromCart: identity,

    setOrder: identity,

    resetCart: just([]),

    onCouponChange: identity,
    onAjaxError: identity
  }),

  reducers: ({ actions }) => ({
    developersInCart: [
      [],
      {
        [actions.removeFromCart]: (developers, developer) =>
          reject(["developer.login", developer.login], developers),
        [actions.resetCart]: just([]),
        [actions.addDeveloperToCart]: (state, developer) =>
          uniqBy("developer.login", [developer].concat(state))
      }
    ],
    order: [
      null,
      {
        [actions.setOrder]: just()
      }
    ],

    coupon: [
      "",
      {
        [actions.onCouponChange]: just(),
        [actions.resetCart]: just("")
      }
    ]
  }),

  selectors: ({ selectors }) => ({
    cartSum: [
      () => [selectors.developersInCart],
      (developersInCart: ICartDeveloper[]) =>
        sumBy(
          (devCart: ICartDeveloper) => devCart.orderInfo.totalPrice,
          developersInCart
        )
    ]
  })
});

export function CartPanel({
  developersInCart,
  actions,
  cartSum,
  coupon
}: IReducerState & ISelectorState & { actions: IActions }) {
  return (
    <div className="panel panel-primary sticky-top">
      <div className="panel-heading">
        <h3 className="panel-title">Shopping cart</h3>
      </div>
      <div className="panel-body">
        <div>
          <ul className="list-group">
            {developersInCart.length ? (
              developersInCart.map(({ developer, orderInfo }) => (
                <CartElement
                  key={`${developer.login}`}
                  developer={developer}
                  orderInfo={orderInfo}
                  removeFromCart={() => actions.removeFromCart(developer)}
                />
              ))
            ) : (
              <i
                className="material-icons md-48"
                style={{ margin: "0px auto" }}
              >
                shopping_cart
              </i>
            )}
          </ul>
          <div
            className="input-group mb-3"
            style={{
              marginTop: "20px"
            }}
          >
            <div className="input-group-prepend">
              <span className="input-group-text">Coupon</span>
            </div>
            <input
              id="coupon-entry"
              placeholder="e.g. SHIPIT"
              value={coupon}
              onChange={evt => actions.onCouponChange(evt.target.value)}
              className="form-control"
              type="text"
            />
          </div>
          <div className="text-center">
            <h4>{cartSum}$</h4>
          </div>
          <button
            id="open-modal-confirm"
            data-toggle="modal"
            disabled={!cartSum}
            data-target="#confirmModal"
            onClick={() =>
              actions.setOrder({
                cartSum,
                cart: developersInCart,
                coupon
              })
            }
            className="btn btn-block btn-info"
          >
            Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default logic(CartPanel);
