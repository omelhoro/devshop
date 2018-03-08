/**
 * Angular bootstrapping
 */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from 'environments/environment';
import { bootloader } from '@angularclass/hmr';

/**
 * App Module
 * our top level module that holds all of our components
 */
import { AppModule } from './app';

/**
 * Bootstrap our Angular app with a top level NgModule
 */
export function main(): Promise<any> {
	if ('development' === ENV && HMR === true) {
		module.hot.accept();
	}

	return platformBrowserDynamic()
		.bootstrapModule(AppModule)
		.then(environment.decorateModuleRef)
		.catch((err) => console.error(err));
}

/**
 * Needed for hmr
 * in prod this is replace for document ready
 */
switch (document.readyState) {
	case 'loading':
		document.addEventListener('DOMContentLoaded', _domReadyHandler, false);
		break;
	case 'interactive':
	case 'complete':
	default:
		bootloader(main);
	// main();
}

function _domReadyHandler() {
	document.removeEventListener('DOMContentLoaded', _domReadyHandler, false);
	bootloader(main);
	// main();
}
bootloader(main);
