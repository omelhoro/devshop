import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { DevPageComponent as DevShopComponent } from './dev-shop-page';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';

export const ROUTES: Routes = [
	{ path: '', component: AboutComponent },
	{ path: 'shop', component: DevShopComponent },
	// { path: 'shop', component: DevShopComponent },
	// { path: 'detail', loadChildren: './+detail#DetailModule' },
	// { path: 'barrel', loadChildren: './+barrel#BarrelModule' },
	// { path: '**', component: NoContentComponent },
];
