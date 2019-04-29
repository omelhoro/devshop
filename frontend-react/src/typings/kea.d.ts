import {Action} from 'redux'

// just some mock definitions, they are not complete --- igor
declare module "kea" {
  type KeyedMap<T, S> = { readonly [key in keyof T]: S }; // eslint-disable-line
  type KeyedMapMirror<T> = { readonly [key in keyof T]?: symbol }; // eslint-disable-line
  // type KeyedMapSubset<T, S> = { readonly [key in keyof T]?: S }; // eslint-disable-line

  type Dispatcheable<T> {
    readonly [func in keyof T]: (
      ...args: Parameters<T[func]>
    ) => Action<ReturnType<T[func]>>
  };

  function kea<IActions, IReducer, ISelector, IWorkers>(logic: {
    connect?: any;

    path: () => string[];

    actions: () => IActions;

    reducers: (
      opts: {
        actions: KeyedMapMirror<IActions>;
      }
    ) => {
      [key in keyof IReducer]: [
        IReducer[key],
        {
          [funcName in keyof IActions]?: (
            state: IReducer[key],
            payload: ReturnType<IActions[funcName]>
          ) => IReducer[key]
        }
      ]
    };

    selectors?: (
      opts: {
        selectors: KeyedMap<IReducer, string>;
      }
    ) => KeyedMap<ISelector, [() => any[], (...args) => any, any?]>;

    takeLatest?: (
      opts: {
        actions: KeyedMapMirror<IActions>;
        workers: IWorkers;
      }
    ) => {
      [funcName in keyof IActions]?: (
        action: { payload: ReturnType<IActions[funcName]> }
      ) => void
    };

    start?: () => any;

    workers?: IWorkers;
  });

  function getStore(opts: {
    middleware: any[];
    plugins: any[];
    preloadedState: any;
    reducers: {};
  }): any;
}

declare module "kea-saga" {
  function keaSaga(): any;
  export default keaSaga;
}
