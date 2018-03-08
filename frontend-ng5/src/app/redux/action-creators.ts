import * as actionConstants from './actions';
import { IShoppingState } from './initialState';

const BACKEND_ENDPOINT = process.env.BACKEND_ENDPOINT;
console.log('Requests go to', BACKEND_ENDPOINT);

// ------------------------------------
// Actions
// ------------------------------------

export function addToCard(e) {
	if (e.appAdded.totalSum) {
		return {
			type: actionConstants.ADDTOCARD,
			item: e,
		};
	} else {
		return {
			type: actionConstants.SKIPCHANGE,
		};
	}
}

export function changePageSize(size) {
	return {
		type: actionConstants.UPDATEPAGESIZE,
		payload: size,
	};
}

export function resetCart() {
	return {
		type: actionConstants.RESETCARD,
	};
}

export function changeStage(stage) {
	return {
		type: actionConstants.CHANGESTATEORDER,
		stage,
	};
}


export function calculatePrice(obj, e) {
	const value = parseInt(e.target.value, 10);
	return {
		type: actionConstants.SETPRICE,
		value: value > -1 ? value : 0,
		item: obj,
	};
}

export function removeFromCard(e) {
	return {
		type: actionConstants.REMOVEFROMCARD,
		item: e,
	};
}

export function addToDevList(e) {
	return {
		type: actionConstants.SETDEVLIST,
		devs: e,
	};
}

export function addHistoryOrg(e) {
	return {
		type: actionConstants.ADDHISTORYITEMORG,
		item: e,
	};
}

export function addHistoryUser(e) {
	return {
		type: actionConstants.ADDHISTORYITEMUSER,
		item: e,
	};
}


export function setLoadingState(loading) {
	return {
		type: actionConstants.LOADINGSTATE,
		loading,
	};
}

export function addDevFromName(dev) {
	if (!dev) {
		alert('No input');
		return {
			type: actionConstants.SKIPCHANGE,
		};
	}

	return async (dispatch) => {
		dispatch(setLoadingState(true));
		const out = await fetch(`${BACKEND_ENDPOINT}/api/developer?name=${dev}`);
		dispatch(setLoadingState(false));
		switch (out.status) {
			case 200: {
				const outJson = await out.json();
				dispatch(addToDevList(outJson));
			}
				break;
			case 404:
				alert(`No such developer: ${dev}`);
				return;
			default:
				alert(`An error ocurred on the server: ${out.status}`);
		}
	};
}

export function setToken(token) {
	return {
		type: actionConstants.SETTOKEN,
		token,
	};
}

export function loadState(state) {
	return {
		type: actionConstants.SETSTATE,
		state,
	};
}

export function changePage(page) {
	return {
		type: actionConstants.CHANGEPAGE,
		page,
	};
}

export function loadStateFromToken(token) {
	return async (dispatch) => {
		const out = await fetch(`${BACKEND_ENDPOINT}/api/order?token=${token}`);
		const outJson = await out.json();
		dispatch(loadState(outJson));
	};
}

export function sendOrder(email) {
	return async (dispatch, getState: () => IShoppingState) => {
		const { coupon, shoppingCart } = getState();
		const state = {
			coupon,
			cart: shoppingCart,
			email,
		};

		const request = {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify(state),
		};

		const out = await fetch(`${BACKEND_ENDPOINT}/api/order`, request);
		const outJson = await out.json();
		dispatch(setToken(outJson.token));
	};
}

export function addDevFromOrg(org) {
	if (!org) {
		alert('No input');
		return {
			type: actionConstants.SKIPCHANGE,
		};
	}

	return async (dispatch) => {
		dispatch(setLoadingState(true));
		const out = await fetch(`${BACKEND_ENDPOINT}/api/members?orgName=${org}`);
		dispatch(setLoadingState(false));
		switch (out.status) {
			case 200: {
				const outJson = await out.json();
				dispatch(addToDevList(outJson));
			}
				break;
			case 404:
				alert(`No such organisation: ${org}`);
				return;
			default:
				alert(`An error ocurred on the server: ${out.status}`);
		}
	};
}

export function endOrdering() {
	return {
		type: actionConstants.RESETSTATE,
	};
}

export function setName(name) {
	return {
		type: actionConstants.UPDATENAME,
		name,
	};
}

export function componentOnline(name) {
	return {
		type: actionConstants.SKIPCHANGE,
		name,
	};
}

export function useCoupon(event) {
	const value = event.target.value;
	let discount;
	switch (value) {
		case 'SHIPIT':
			discount = 10;
			break;
		case 'GETIDONE':
			discount = 40;
			break;
		default:
			discount = 0;
	}
	return {
		type: actionConstants.USECOUPON,
		value,
		discount,
	};
}
