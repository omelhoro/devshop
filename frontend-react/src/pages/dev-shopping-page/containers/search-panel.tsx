import { kea, Dispatcheable } from "kea";
import { concat, flow, identity, mapValues, set, uniqBy } from "lodash/fp";
import * as React from "react";
import { put } from "redux-saga/effects";
import * as developerService from "~/src/services/developer";
import handleAjaxError from "~/src/utils/handle-ajax-error";
import SearchForm from "../components/search-form";

interface IReducerState {
  developers: IDeveloper[];
  loading: { [loader in keyof IWorkers]: boolean };
}

interface IActions {
  addDevelopersToList(developer: IDeveloper[]): IDeveloper[];
  importDevelopers(name: string): string;
  onAjaxError(errorMsg: string): string;
}

interface IWorkers {
  importDevelopers: (name: ReturnType<IActions["importDevelopers"]>) => void;
}

interface ISelectorState {
  cartSum: number;
  devsInCartMap: {};
  pagedDevList: IDeveloper[][];
}

interface IDeveloper {
  login: string;
}

export const logic = kea<IActions, IReducerState, ISelectorState, IWorkers>({
  path: () => ["scenes", "search"],

  actions: () => ({
    importDevelopers: identity,
    addDevelopersToList: identity,
    onAjaxError: identity
  }),

  reducers: ({ actions }) => ({
    developers: [
      [],
      {
        [actions.addDevelopersToList]: (previousResult, newResult) =>
          flow(
            concat(newResult),
            uniqBy("login")
          )(previousResult)
      }
    ],
    loading: [
      { importDevelopers: false, findDeveloperByOrgName: false },
      {
        [actions.addDevelopersToList]: mapValues(false),
        [actions.importDevelopers]: set("importDevelopers", true),
        [actions.onAjaxError]: mapValues(false)
      }
    ]
  }),

  takeLatest: ({ actions, workers }) => ({
    [actions.importDevelopers]: action =>
      workers.importDevelopers(action.payload)
  }),

  workers: {
    *importDevelopers(name) {
      const { addDevelopersToList, onAjaxError } = this
        .actions as Dispatcheable<IActions>;
      try {
        const [developer, developersFromOrg] = yield Promise.all([
          developerService.findByName(name),
          developerService.findByOrgName(name)
        ]);
        yield put(
          addDevelopersToList([].concat(developer).concat(developersFromOrg))
        );
      } catch (error) {
        const msg = yield handleAjaxError(error);
        yield put(onAjaxError(msg));
      }
    }
  }
});

export function SearchContainer({
  loading,
  actions: { importDevelopers }
}: IReducerState & ISelectorState & { actions: IActions }) {
  return (
    <div>
      <div className="row">
        <SearchForm
          loading={loading.importDevelopers}
          fetch={importDevelopers}
        />
      </div>
    </div>
  );
}

export default logic(SearchContainer);
