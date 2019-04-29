import * as React from "react";
import DevImage from "./dev-image";

export default ({
  developer,
  addDeveloperToCart,
  onHoursChange,
  isInCart,
  removeFromCart,
  orderPrice,
  orderedHours
}) => {
  return (
    <div
      className="card developer-entry"
      id={`${developer.login}-data`}
      style={{
        padding: "10px",
        marginBottom: "20px"
      }}
    >
      <div
        className="media"
        style={{
          flexWrap: "wrap"
        }}
      >
        <div className="media-left media-top">
          <div>
            <DevImage src={developer.avatar_url} alt={developer.login} />
          </div>
        </div>
        <div className="media-body">
          <h4 className="media-heading">{developer.login}</h4>

          <table className="table table-bordered table-hovered">
            <tbody>
              <tr>
                <td>Followers</td>
                <td>{developer.followers}</td>
              </tr>
              <tr>
                <td>Gists</td>
                <td>{developer.public_gists}</td>
              </tr>
              <tr>
                <td>Repos</td>
                <td>{developer.public_repos}</td>
              </tr>
              <tr>
                <td>Registered since</td>
                <td>{new Date(developer.created_at).getUTCFullYear()}</td>
              </tr>
              <tr>
                <td>Estimated price (hourly)</td>
                <td>
                  <span className="price">{developer.appAdded.price}</span>$
                </td>
              </tr>
              <tr>
                <td>Ordered hours</td>
                <td>
                  <input
                    className="form-control hours"
                    value={orderedHours}
                    disabled={isInCart}
                    onChange={evt =>
                      onHoursChange(
                        developer,
                        Number.parseInt(evt.target.value, 10)
                      )
                    }
                    min={0}
                    type="number"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="">
            <button
              disabled={!orderedHours}
              hidden={isInCart}
              className="btn btn-block btn-success add-to-card"
              onClick={() => addDeveloperToCart(developer)}
            >
              Add {developer.login} to cart for {orderPrice}$
            </button>
            <button
              className="btn btn-block btn-warning"
              hidden={!isInCart}
              onClick={() => removeFromCart(developer)}
            >
              Remove from cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
