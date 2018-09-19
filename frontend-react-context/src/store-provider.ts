import * as React from 'react';
import { initialState, IInitialState, actions } from './state';

type IActions = ReturnType<typeof actions>;

export type IContext = IInitialState & { actions: IActions };

export const { Provider, Consumer } = React.createContext(initialState);

// a special function that works as a proxy, so we can always save the store to localstorage on dev
const _setState = (component) => (partialState: Partial<IInitialState>) => {
	component.setState(partialState, () => {
		if (process.env.NODE_ENV === 'development') {
			(localStorage as any).state = JSON.stringify(component.state);
		}
	});
};

export class AppProvider extends React.Component<{ history: any }> {

	actions: IActions = actions(this, _setState(this));

	state: IContext = { ...initialState, actions: this.actions };

	constructor(props) {
		super(props);
		if (process.env.NODE_ENV === 'development' && (localStorage as any).state) {
			const state = JSON.parse((localStorage as any).state);
			this.state = { ...state, actions: actions(this, _setState(this)) };
		}
	}

}
