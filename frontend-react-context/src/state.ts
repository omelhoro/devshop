import produce from "immer";

export const initialState = {
  developersInCart: [],
  developers: [],
  token: "",
  coupon: "",
  currentPage: 0
};

export type IInitialState = typeof initialState;
type ISetState = (state: Partial<IInitialState>, cb?: () => void) => void;

export function actions(c: { state: IInitialState }, setState: ISetState) {
  return {
    changeDevHours: (entity, hours) => {
      const ix = c.state.developers.findIndex(_p => entity.id === _p.id);
      const developers = produce(c.state.developers, draft => {
        draft[ix].appAdded.orderedHours = hours;
        draft[ix].appAdded.totalSum =
          hours * c.state.developers[ix].appAdded.price;
      });
      setState({ developers });
    },
    setToken: token => setState({ token }),
    addDevToCart: a =>
      setState({
        developersInCart: [a, ...c.state.developersInCart]
      }),
    removeFromCart: a =>
      setState({
        developersInCart: c.state.developersInCart.filter(
          item => item.login !== a.login
        )
      }),
    onCouponChange: value => setState({ coupon: value }),
    resetCart: () => setState({ developersInCart: [] }),
    changePage: page => setState({ currentPage: page }),
    addDevelopers: developers =>
      setState({ developers: [...developers, ...c.state.developers] })
  };
}

export type ModelCollections = any[];
