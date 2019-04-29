import { kea, Dispatcheable } from "kea";
import { concat, flow, identity, mapValues, set, uniqBy } from "lodash/fp";
import * as React from "react";
import { Action } from "redux";
import { put } from "redux-saga/effects";
import * as developerService from "~/src/services/developer";
import handleAjaxError from "~/src/utils/handle-ajax-error";
import SearchFormOrg from "../components/search-form-organisations";
import SearchFormUser from "../components/search-form-user";

interface IReducerState {
  developers: IDeveloper[];
  loading: { [loader in keyof IWorkers]: boolean };
}

interface IActions {
  addDevelopersToList(developer: IDeveloper | IDeveloper[]): IDeveloper;
  findDeveloperByName(name: string): string;
  findDeveloperByOrgName(name: string): string;
  onAjaxError(errorMsg: string): string;
}

interface IWorkers {
  findDeveloperByName: (
    name: ReturnType<IActions["findDeveloperByName"]>
  ) => void;
  findDeveloperByOrgName: (
    name: ReturnType<IActions["findDeveloperByOrgName"]>
  ) => void;
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
    findDeveloperByName: identity,
    findDeveloperByOrgName: identity,
    addDevelopersToList: identity,
    onAjaxError: identity
  }),

  reducers: ({ actions }) => ({
    developers: [
      [],
      {
        [actions.addDevelopersToList]: (developers, developer) =>
          flow(
            concat(developer),
            uniqBy("login")
          )(developers)
      }
    ],
    loading: [
      { findDeveloperByName: false, findDeveloperByOrgName: false },
      {
        [actions.addDevelopersToList]: mapValues(false),
        [actions.findDeveloperByName]: set("findDeveloperByName", true),
        [actions.findDeveloperByOrgName]: set("findDeveloperByOrgName", true),
        [actions.onAjaxError]: mapValues(false)
      }
    ]
  }),

  takeLatest: ({ actions, workers }) => ({
    [actions.findDeveloperByName]: action =>
      workers.findDeveloperByName(action.payload),
    [actions.findDeveloperByOrgName]: action =>
      workers.findDeveloperByOrgName(action.payload)
  }),

  workers: {
    *findDeveloperByName(name) {
      const { addDevelopersToList, onAjaxError } = this
        .actions as Dispatcheable<IActions>;
      try {
        const developer = yield developerService.findByName(name);
        yield put(addDevelopersToList(developer));
      } catch (error) {
        const msg = yield handleAjaxError(error);
        yield put(onAjaxError(msg));
      }
    },
    *findDeveloperByOrgName(name) {
      const { addDevelopersToList, onAjaxError } = this
        .actions as Dispatcheable<IActions>;
      try {
        const developer = yield developerService.findByOrgName(name);
        yield put(addDevelopersToList(developer));
      } catch (error) {
        const msg = yield handleAjaxError(error);
        yield put(onAjaxError(msg));
      }
    }
  }
});

export function SearchContainer({
  loading,
  actions: { findDeveloperByOrgName, findDeveloperByName }
}: IReducerState & ISelectorState & { actions: IActions }) {
  return (
    <div>
      <div className="row">
        <SearchFormUser
          loading={loading.findDeveloperByName}
          fetch={findDeveloperByName}
        />
      </div>

      <div className="row">
        <SearchFormOrg
          loading={loading.findDeveloperByOrgName}
          fetch={findDeveloperByOrgName}
        />
      </div>
    </div>
  );
}

export default logic(SearchContainer);
