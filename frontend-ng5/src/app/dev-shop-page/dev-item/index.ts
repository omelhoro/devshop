import { Component, Inject, Input } from '@angular/core';

import { AppState } from '../../app.service';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'newDate' })
export class NewDate implements PipeTransform {
	transform(str: string) {
		return new Date(str);
	}
}


@Pipe({ name: 'shorten' })
export class Shorten implements PipeTransform {
	transform(str: string) {
		if (str && str.length > 20) {
			return str.slice(0, 20) + '...';
		} else {
			return str;
		}
	}
}

@Component({
	// The selector is what angular internally uses
	// for `document.querySelectorAll(selector)` in our index.html
	// where, in this case, selector is the string 'home'
	selector: 'dev-item',  // <home></home>
	// We need to tell Angular's Dependency Injection which providers are in our app.
	providers: [
	],
	// We need to tell Angular's compiler which directives are in our template.
	// Doing so will allow Angular to attach our behavior to an element
	// directives: [
	// ],
	inputs: [
		'dev',
		'canOrder',
	],

	// We need to tell Angular's compiler which custom pipes are in our template.
	// pipes: [NewDate, Shorten],
	// Our list of styles in our component. We may add more to compose many styles together
	styles: [
		`
      .hours-price {
        padding-right: 10px;
      }
      .total-price {
        padding-left: 10px;
      }

      .dev-item {
        margin-bottom: 10px;
      }

      .interact-buttons {
        width: 160px;
      }

    `,
	],
	// Every Angular template is first compiled by the browser before Angular runs it's compiler
	template: `
  <mat-card class="dev-item">
    <mat-card-header>
       <img mat-card-avatar src={{dev.avatar_url}} >
       <mat-card-title>{{dev.login}}</mat-card-title>
       <mat-card-subtitle>Company: {{dev.company | shorten}}</mat-card-subtitle>
    </mat-card-header>

    <mat-card-content>
      <mat-card-subtitle>{{dev.followers}} Followers</mat-card-subtitle>
      <mat-card-subtitle>{{dev.public_repos}} Public Repos</mat-card-subtitle>
      <mat-card-subtitle>{{dev.public_gists}} Public Gists</mat-card-subtitle>
      <mat-card-subtitle>Since {{dev.created_at | newDate | date: 'YYYY' }} at GitHub
        </mat-card-subtitle>
      <mat-card-subtitle>{{dev.email}} </mat-card-subtitle>
			<mat-form-field class="" style="width: 100%; font-size: large">

      <input matInput [disabled]="dev.isInCard" [value]="dev.appAdded.orderedHours || ''"
        placeholder="amount of hours" (change)="onInput(dev, $event)" align="end">

        <span class="hours-price" mat-prefix>{{dev.appAdded.price}}$/Hour  </span>
        <span class="total-price" mat-suffix> = {{dev.appAdded.totalSum | number}}$</span>
				</mat-form-field>

      <mat-card-subtitle>
				<div [hidden]="dev.isInCard">
        <button mat-raised-button class="interact-buttons"
          [disabled]="dev.isInCard || !dev.appAdded.totalSum || !canOrder"
          (click)="addDev(dev)" color="primary">Add to cart
				</button>
				</div>
				<div [hidden]="!dev.isInCard">
        <button mat-raised-button [disabled]="!dev.isInCard || !canOrder"
        (click)="removeDev(dev)" class="interact-buttons" color="warn">Remove from cart
				</button>
				</div>
      </mat-card-subtitle>
    </mat-card-content>
  </mat-card>
  `
})
export class DevItemComponent {

	constructor(
		public appState: AppState
		// , @Inject('Actions') private actions
	) {

	}

	onInput(dev, event) {
		this.appState.store.dispatch(this.appState.actions.calculatePrice(dev, event));
	}

	addDev(dev) {
		this.appState.store.dispatch(this.appState.actions.addToCard(dev));
	}

	removeDev(dev) {
		this.appState.store.dispatch(this.appState.actions.removeFromCard(dev));
	}

}
