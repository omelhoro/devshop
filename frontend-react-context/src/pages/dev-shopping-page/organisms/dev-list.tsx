import * as React from "react";
import { Consumer, IContext } from "../../../store-provider";
import Pagination from "../molecules/pagination";
import ListElement from "../molecules/dev-list-entry";
import { createSelector } from "reselect";
import * as _ from "lodash";

const paginateListFn = createSelector(
  _.identity,
  (val: any[]) => _.chunk(val, 7)
);

const devsInCartMapFn = createSelector(
  _.identity,
  (val: any[]) =>
    val.reduce((acc, item) => ({ ...acc, [item.login]: true }), {})
);

export const Component = ({ context }) => {
  const pagedDevList = paginateListFn(context.developers);
  const devsInCartMap = devsInCartMapFn(context.developersInCart);

  return (
    <div id="developers-list">
      <div className="d-flex justify-content-center">
        <Pagination
          pages={pagedDevList.length}
          currentPage={context.currentPage}
          onPageChange={page => context.actions.changePage(page)}
        />
      </div>

      {context.developers.length ? (
        pagedDevList[context.currentPage].map(developer => (
          <ListElement
            key={`developer-entry-${developer.login}`}
            onHoursChange={evt =>
              context.actions.changeDevHours(
                developer,
                Number(evt.target.value)
              )
            }
            addDevelopersToCart={() => context.actions.addDevToCart(developer)}
            removeFromCart={() => context.actions.removeFromCart(developer)}
            element={developer}
            isInCart={devsInCartMap[(developer as any).login]}
          />
        ))
      ) : (
        <div className="jumbotron">
          <h1 className="display-4">No developers found</h1>
        </div>
      )}

      <div className="d-flex justify-content-center">
        <Pagination
          pages={pagedDevList.length}
          currentPage={context.currentPage}
          onPageChange={page => context.actions.changePage(page)}
        />
      </div>
    </div>
  );
};

export default () => (
  <Consumer>{(context: IContext) => <Component context={context} />}</Consumer>
);
