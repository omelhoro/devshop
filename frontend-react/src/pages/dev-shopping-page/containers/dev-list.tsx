import { kea } from "kea";
import { chunk, get, identity, nthArg } from "lodash/fp";
import * as React from "react";
import ListElement from "../components/dev-list-entry";
import Pagination from "../components/pagination";
import {
  IActions as IActionsCart,
  IReducerState as IReducerStateCart,
  logic as cartLogic
} from "./cart-panel";

interface IReducerState {
  developers?: IDeveloper[];
  developerOrderInfo: {
    [login: string]: { hours: number; totalPrice: number };
  };
  currentPage: number;
}

interface IActions {
  changeDevHours(developer: IDeveloper, hours: number): { developer; hours };
  changePage(page: number): number;
  onAjaxError(errorMsg: string): string;
}

interface ISelectorState {
  pagedDevList: IDeveloper[][];
}

interface IDeveloper {
  login: string;
}

const logic = kea<IActions, IReducerState, ISelectorState, {}>({
  connect: {
    actions: [cartLogic, ["addDeveloperToCart", "removeFromCart"]],
    props: [
      get("scenes.search"),
      ["developers"],
      get("scenes.cart"),
      ["developersInCart"]
    ]
  },

  path: () => ["scenes", "dev-list"],

  actions: () => ({
    changeDevHours: (developer: IDeveloper, hours) => ({ developer, hours }),
    changePage: identity,
    onAjaxError: identity
  }),

  reducers: ({ actions }) => ({
    developerOrderInfo: [
      {},
      {
        [actions.changeDevHours]: (state, { developer, hours }, ...args) => ({
          ...state,
          [developer.login]: {
            hours,
            totalPrice: hours * developer.appAdded.price
          }
        })
      }
    ],
    currentPage: [
      0,
      {
        [actions.changePage]: nthArg(1)
      }
    ]
  }),

  selectors: ({ selectors }) => ({
    pagedDevList: [() => [selectors.developers], chunk(7)]
  })
});

export function DevList({
  developers = [],
  pagedDevList = [],
  actions,
  developerOrderInfo,
  developersInCart,
  currentPage
}: IReducerState &
  ISelectorState & { actions: IActions & IActionsCart } & Pick<
    IReducerStateCart,
    "developersInCart"
  >) {
  return (
    <div id="developers-list">
      <div className="d-flex justify-content-center">
        <Pagination
          pages={pagedDevList.length}
          currentPage={currentPage}
          onPageChange={actions.changePage}
        />
      </div>

      {developers.length ? (
        pagedDevList[currentPage].map(developer => {
          const totalPrice = developerOrderInfo[developer.login]
            ? developerOrderInfo[developer.login].totalPrice
            : 0;
          const hours = developerOrderInfo[developer.login]
            ? developerOrderInfo[developer.login].hours
            : 0;
          return (
            <ListElement
              key={`developer-entry-${developer.login}`}
              onHoursChange={actions.changeDevHours}
              addDeveloperToCart={() =>
                actions.addDeveloperToCart(developer, { hours, totalPrice })
              }
              removeFromCart={actions.removeFromCart}
              developer={developer}
              orderPrice={totalPrice}
              orderedHours={hours}
              isInCart={developersInCart.find(
                ({ developer: _developer }) =>
                  _developer.login === developer.login
              )}
            />
          );
        })
      ) : (
        <div className="jumbotron">
          <h1 className="display-4">No developers found</h1>
        </div>
      )}

      <div className="d-flex justify-content-center">
        <Pagination
          pages={pagedDevList.length}
          currentPage={currentPage}
          onPageChange={actions.changePage}
        />
      </div>
    </div>
  );
}

export default logic(DevList);
