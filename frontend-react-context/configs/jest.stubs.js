// Global/Window object Stubs for Jest
window.matchMedia = window.matchMedia || function () {
	return {
		matches: false,
		addListener() { },
		removeListener() { },
	};
};

window.requestAnimationFrame = function (callback) {
	setTimeout(callback);
};

window.localStorage = {
	getItem() { },
	setItem() { },
};
