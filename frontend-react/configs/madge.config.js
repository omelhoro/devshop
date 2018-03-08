module.exports = {
	resolve: {
		modules: ['src', 'node_modules'],
		alias: {
			app: './out/store',
			store: './out/app',
			pages: './out/pages',
			services: './out/services',
		},
	},

};
