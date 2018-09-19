export const initialState = {
	developersInCart: [],
	developers: [],
	token: '',
	coupon: '',
	currentPage: 0,
};

export type IInitialState = typeof initialState;
type ISetState = (state: Partial<IInitialState>, cb?: () => void) => void;

export function actions(c: { state: IInitialState }, setState: ISetState) {

	return {
		changeDevHours: (entity, hours) => {
			const ix = c.state.developers.findIndex((_p) => entity.id === _p.id);
			const newEntity = {
				...c.state.developers[ix], appAdded: {
					...c.state.developers[ix].appAdded,
					orderedHours: hours,
					totalSum: hours * entity.appAdded.price
				}
			};
			setState({
				developers: [
					...c.state.developers.slice(0, ix),
					newEntity,
					...c.state.developers.slice(ix + 1)]
			});
		},
		setToken: (token) => setState({ token }),
		addDevToCart: (a) => setState({
			developersInCart: [a, ...c.state.developersInCart]
		}),
		removeFromCart: (a) => setState({
			developersInCart: c.state.developersInCart.filter((item) => item.login !== a.login)
		}),
		onCouponChange: (value) => setState({ coupon: value }),
		resetCart: () => setState({ developersInCart: [] }),
		changePage: (page) => setState({ currentPage: page }),
		addDevelopers: (developers) => setState({ developers: [...developers, ...c.state.developers] })
	};
}

export type ModelCollections = any[];
