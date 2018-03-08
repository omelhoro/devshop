module.exports = {
	"extends": "airbnb",
	"parser": "typescript-eslint-parser",
	"globals": {
		"document": true,
		"window": true
	},
	"plugins": [
		"mocha"
	],
	"rules": {
		"jsx-a11y/label-has-for": [
			2,
			{
				"components": [
					"Label"
				],
				"required": {
					"every": [
						"id"
					]
				},
				"allowChildren": false
			}
		],
		"no-restricted-globals": 0,
		"no-else-return": 0,
		"no-confusing-arrow": 0,
		"no-useless-constructor": 0,
		// no need since using typescript
		"react/prop-types": 0,
		"import/no-extraneous-dependencies": 0,
		// dont work well with typescript
		// "import/prefer-default-export": 0,
		// classes are more natural to typescript than stateless functions
		"react/prefer-stateless-function": 0,
		// eslinter can't recognize exported type
		"no-unused-vars": 0,
		"no-undef": 0,
		// "react/jsx-no-bind": 0,
		"max-len": [
			1,
			120
		],
		"react/no-unsecaped-entites": 0,
		"react/self-closing-comp": 0,
		"react/void-dom-elements-no-children": 0,
		"react/jsx-indent": 0,
		"react/jsx-indent-props": 0,
		"react/jsx-max-props-per-line": 0,
		"react/jsx-filename-extension": [
			"error",
			{
				"extensions": [
					".jsx",
					".tsx"
				]
			}
		],
		"import/extensions": 0,
		"no-tabs": 0,
		"global-require": 0,
		"import/no-unresolved": 0,
		"mocha/handle-done-callback": "error",
		"mocha/no-exclusive-tests": "warn",
		"quotes": [
			"error",
			"single"
		],
		"react/jsx-quotes": "off",
		"jsx-quotes": [
			"error",
			"prefer-double"
		],
		"comma-dangle": [
			"warn",
			"always-multiline"
		],
		"array-bracket-spacing": [
			"off",
			"never"
		],
		"indent": [
			"error",
			"tab",
			{
				"SwitchCase": 1
			}
		],
		"no-alert": "off",
		"space-in-parens": "off",
		"object-curly-spacing": [
			"error",
			"always"
		],
		"padded-blocks": "off",
		"no-restricted-syntax": [
			"off",
			"ForInStatement"
		],
		"id-length": [
			"error",
			{
				"min": 3,
				"max": 24,
				"exceptions": [
					"componentWillReceiveProps",
					"createStoreWithMiddleware",
					"$",
					"to",
					"db"
				]
			}
		],
		"curly": "off",
		"quote-props": "off",
		"no-param-reassign": "off",
		"no-console": "off",
		"img-redundant-alt": "off",
		"key-spacing": "off",
		"no-underscore-dangle": "off",
		"array-callback-return": "error",
		"dot-notation": "error",
		"default-case": "off",
		"arrow-body-style": "off",
		"prefer-template": "error",
		"no-nested-ternary": "off"
	},
	"env": {
		"browser": true,
		"es6": true,
		"node": true
	}
}