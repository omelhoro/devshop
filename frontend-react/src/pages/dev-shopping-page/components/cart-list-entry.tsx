import * as React from "react";
import moment from "moment";

export default ({ developer, removeFromCart, orderInfo }) => (
  <li
    key={`shoppingcart-${developer.login}`}
    className="list-group-item d-flex justify-content-between align-items-center"
  >
    <div>
      {developer.login} ({orderInfo.totalPrice}$)
      <br />
      <small>
        Added on {moment(orderInfo.addedToCart).format("HH:mm DD.MM.YY")}
      </small>
    </div>
    <span
      className="badge badge-warning badge-pill"
      style={{
        cursor: "pointer"
      }}
      onClick={removeFromCart}
    >
      <i className="material-icons">close</i>
    </span>
  </li>
);
