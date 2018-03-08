import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';

/*
 * Platform and Environment providers/directives/pipes
 */
import { environment } from 'environments/environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { DevPageComponent } from './dev-shop-page';
import { NoContentComponent } from './no-content';
import { XLargeDirective } from './home/x-large';
import { MaterialModule } from './material.module';
import { DevModuleModule } from './+dev-module';

import { DevItemComponent, Shorten, NewDate } from './dev-shop-page/dev-item';
import CartItem from './dev-shop-page/cart-item';
import { ApplicationRef } from '@angular/core';

import '../styles/styles.scss';
import '../styles/headings.css';

// Application wide providers
const APP_PROVIDERS = [
	...APP_RESOLVER_PROVIDERS,
	AppState,
];

interface StoreType {
	state: InternalStateType;
	restoreInputValues: () => void;
	disposeOldHosts: () => void;
}

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
	bootstrap: [AppComponent],
	declarations: [
		AppComponent,
		DevPageComponent,
		AboutComponent,
		HomeComponent,
		NoContentComponent,
		XLargeDirective,
		DevItemComponent,
		CartItem,
		Shorten, NewDate
	],
	/**
	   * Import Angular's modules.
	   */
	imports: [
		BrowserModule,
		MaterialModule,
		BrowserAnimationsModule,
		FormsModule,
		HttpClientModule,
		RouterModule.forRoot(ROUTES, {
			useHash: Boolean(history.pushState) === false,
			preloadingStrategy: PreloadAllModules
		}),

		/**
			 * This section will import the `DevModuleModule` only in certain build types.
			 * When the module is not imported it will get tree shaked.
			 * This is a simple example, a big app should probably implement some logic
			 */
		...environment.showDevModule ? [DevModuleModule] : [],
	],
	/**
	   * Expose our Services and Providers into Angular's dependency injection.
	   */
	providers: [
		environment.ENV_PROVIDERS,
		APP_PROVIDERS
	]
})
export class AppModule {
	constructor(public appRef: ApplicationRef) { }
	hmrOnInit(store) {
		console.log('HMR store');
		if (!store || !store.state) return;
		console.log('HMR store', store);
		console.log('store.state.data:', store.state.data)
		// inject AppStore here and update it
		// this.AppStore.update(store.state)
		if ('restoreInputValues' in store) {
			store.restoreInputValues();
		}
		// change detection
		this.appRef.tick();
		delete store.state;
		delete store.restoreInputValues;
	}
	hmrOnDestroy(store) {
		console.log('HMR store');
		var cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
		// recreate elements
		store.disposeOldHosts = createNewHosts(cmpLocation)
		// inject your AppStore and grab state then set it on store
		// var appState = this.AppStore.get()
		store.state = { data: 'yolo' };
		// store.state = Object.assign({}, appState)
		// save input values
		store.restoreInputValues = createInputTransfer();
		// remove styles
		removeNgStyles();
	}
	hmrAfterDestroy(store) {
		// display new elements
		store.disposeOldHosts()
		delete store.disposeOldHosts;
		// anything you need done the component is removed
	}

}
