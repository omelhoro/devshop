import { kea } from 'kea';
import PropTypes from 'prop-types';
import * as React from 'react';

interface IReducerState {
	counter: number,
	counterLoading: boolean,
}

interface ISelectorState {
	doubleCounter: number,
}

interface IActions {
	increment: (amount: number) => { amount: number },
	decrement: (amount: number) => { amount: number },
	doubleAsync: (amount: number) => { amount: number },
	set: (amount: number) => { amount: number },
	showError: (errorMsg: string) => { errorMsg: string },
}

const logic = kea<IActions, IReducerState, ISelectorState, {}>({

	path: () => ['scenes', 'counter'],

	actions: () => ({
		increment: (amount) => ({ amount }),
		decrement: (amount) => ({ amount }),
		doubleAsync: (amount) => ({ amount }),
		set: (amount) => ({ amount }),
		showError: (errorMsg) => ({ errorMsg }),
	}),

	reducers: ({ actions }) => ({

		counter: [0, PropTypes.number, {
			[actions.set]: (state, payload) => payload.amount,
			[actions.increment]: (state, payload) => state + payload.amount,
			[actions.decrement]: (state, payload) => state - payload.amount,
		}],

		counterLoading: [false, PropTypes.boolean, {
			[actions.doubleAsync]: (state, payload) => true,
			[actions.set]: (state, payload) => false,
			[actions.showError]: (state, payload) => false,
		}],

	}),

	selectors: ({ selectors }) => ({
		doubleCounter: [
			() => [selectors.counter],
			(counter: number) => counter * 2,
			PropTypes.number,
		],
	}),

	takeLatest: ({ actions, workers }) => ({
		// [actions.counter.doubleAsync]: workers.doubleCounterAsync,
		// [actions.showError]: workers.showError,
	}),

	workers: {

	},
});

type ICounterPageProps =
	IReducerState &
	ISelectorState;

export class CounterPage extends React.Component<ICounterPageProps, any> {

	actions: IActions;

	componentDidMount() {
		setInterval(() => {
			this.actions.increment(1);
		}, 1000);
	}

	render() {
		const { counter } = this.props;
		return (
			<div
				className="jumbotron"
			>
				<h1 className="display-4">Hallo Welt: {counter}</h1>
				<button onClick={() => this.actions.doubleAsync(2)}>Increment by 2</button>
			</div>
		);
	}
}

export default logic(CounterPage);
