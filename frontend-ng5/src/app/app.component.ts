/**
 * Angular 2 decorators and services
 */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { environment } from 'environments/environment';
import { AppState } from './app.service';

/**
 * App Component
 * Top Level Component
 */
@Component({
	selector: 'app',
	encapsulation: ViewEncapsulation.None,
	styleUrls: [
		'./app.component.css'
	],
	// styles: [
	// 	`
	// 	.content-container {
	// 		margin: 0px auto;
	// 	}
	// 	`
	// ],
	template: `
	<div class="content-container">
		<mat-toolbar color="">
				<span>{{ name }}</span>
				<span class="fill"></span>
				<button style="margin: 10px;" mat-raised-button color="primary" router-active [routerLink]=" [''] ">
					Home
				</button>
				<button  mat-raised-button color="primary" router-active [routerLink]=" ['shop'] ">
					Shopping-List
				</button>
		</mat-toolbar>

		<div [hidden]="!appStore.state.loading">
		<mat-progress-bar mode="indeterminate" color="primary" ></mat-progress-bar>
		</div>

		<router-outlet></router-outlet>
		</div>

  `
})
export class AppComponent implements OnInit {
	public name = 'Devshop by Igor Fischer';
	public tipe = 'assets/img/tipe.png';
	public twitter = 'https://twitter.com/gdi2290';
	public url = 'https://tipe.io';
	public showDevModule: boolean = environment.showDevModule;

	constructor(public appStore: AppState) { }

	public ngOnInit() {
		console.log('Initial App State', this.appStore.state);
	}

}

/**
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
