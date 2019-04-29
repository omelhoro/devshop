import * as React from "react";
import { Consumer, IContext } from "../../../store-provider";
import CartElement from "../molecules/cart-list-entry";
import { createSelector } from "reselect";
import * as _ from "lodash";

export const cartSumFn = createSelector(
  (context: IContext) => context.developersInCart,
  (context: IContext) => context.coupon,
  (devs: any[], coupon) => {
    const sum = devs.reduce((agg, item) => agg + item.appAdded.totalSum, 0);
    if (coupon === "SHIPIT") {
      return sum - sum * 0.1;
    } else {
      return sum;
    }
  }
);

export const Component = ({ context }) => {
  const cartSum = cartSumFn(context);
  return (
    <div className="panel panel-primary sticky-top">
      <div className="panel-heading">
        <h3 className="panel-title">Shopping cart</h3>
      </div>
      <div className="panel-body">
        <div>
          <ul className="list-group">
            {context.developersInCart.length ? (
              context.developersInCart.map(developer => (
                <CartElement
                  key={`${developer.login}`}
                  element={developer}
                  removeFromCart={() =>
                    context.actions.removeFromCart(developer)
                  }
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
              value={context.coupon}
              onChange={evt => context.actions.onCouponChange(evt.target.value)}
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
            className="btn btn-block btn-info"
          >
            Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default () => (
  <Consumer>{context => <Component context={context} />}</Consumer>
);
