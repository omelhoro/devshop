import { Component, Inject } from '@angular/core';

import { AppState } from '../app.service';
import { XLarge } from './x-large';

import { Pipe, PipeTransform } from '@angular/core';

import { shoppingList } from '../redux/initState';

@Component({
	// The selector is what angular internally uses
	// for `document.querySelectorAll(selector)` in our index.html
	// where, in this case, selector is the string 'home'
	selector: 'home',  // <home></home>
	// We need to tell Angular's Dependency Injection which providers are in our app.
	// providers: [
	// 	Title
	// ],
	// We need to tell Angular's compiler which directives are in our template.
	// Doing so will allow Angular to attach our behavior to an element
	// directives: [
	// 	XLarge,
	// 	DevComponent,
	// 	CartItem,
	// ],
	// We need to tell Angular's compiler which custom pipes are in our template.
	// pipes: [],
	// Our list of styles in our component. We may add more to compose many styles together
	styles: [require('./home.css')],
	// Every Angular template is first compiled by the browser before Angular runs it's compiler
	template: require('./home.html'),
})
export class DevPageComponent {
	// Set our default values
	// localState = shoppingList;

	public buffer = {
		lastUserSearch: '',
		lastOrgSearch: '',
		email: '',
		coupon: '',
	};

	// public appStore: AppState;

	// TypeScript public modifiers
	constructor(
		public appStore: AppState,
	) {
		// const unsubscribe = this.appStore.store.subscribe(() => {
		// 	const state = this.appStore.state;
		// this.appState = appState.state;
		// });
	}

	public onInput(dev, event) {
		this.appStore.actions.calculatePrice(dev, event);
	}

	public onPageChangeRequest(event: { pageIndex: number, pageSize: number, length: number }) {
		this.appStore.actions.changePage(event.pageIndex);
		this.appStore.actions.changePageSize(event.pageSize);
	}

	ngOnInit() {
		console.log('I\'m online');
		this.appStore.actions.componentOnline({ type: '' });
	}

	public validateCoupon(value) {
		this.appStore.actions.useCoupon({ target: { value } });
	}

	public goToConfirmOrder() {
		this.appStore.actions.changeStage('confirm');
	}

	public confirmOrder() {
		this.appStore.actions
			.sendOrder(this.buffer.email);
	}

	public resetCart() {
		this.appStore.state
			.shoppingCart
			.forEach(this.appStore.actions.removeFromCard);
	}

	public startFromScratch() {
		this.appStore.actions.endOrdering();
	}

	public revertConfirm() {
		this.appStore.actions.changeStage('choosing');
	}

	public importUser(value) {
		this.appStore.actions.addHistoryUser(value);
		this.appStore.actions.addDevFromName(value);
	}

	public importOrg(value) {
		this.appStore.actions.addHistoryOrg(value);
		this.appStore.actions.addDevFromOrg(value);
	}

}
