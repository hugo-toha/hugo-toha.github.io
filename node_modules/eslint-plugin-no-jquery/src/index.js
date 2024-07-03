'use strict';

module.exports = {
	rules: {
		'no-ajax': require( './rules/no-ajax' ),
		'no-ajax-events': require( './rules/no-ajax-events' ),
		'no-and-self': require( './rules/no-and-self' ),
		'no-animate': require( './rules/no-animate' ),
		'no-animate-toggle': require( './rules/no-animate-toggle' ),
		'no-append-html': require( './rules/no-append-html' ),
		'no-attr': require( './rules/no-attr' ),
		'no-bind': require( './rules/no-bind' ),
		'no-box-model': require( './rules/no-box-model' ),
		'no-browser': require( './rules/no-browser' ),
		'no-camel-case': require( './rules/no-camel-case' ),
		'no-class': require( './rules/no-class' ),
		'no-class-state': require( './rules/no-class-state' ),
		'no-clone': require( './rules/no-clone' ),
		'no-closest': require( './rules/no-closest' ),
		'no-constructor-attributes': require( './rules/no-constructor-attributes' ),
		'no-contains': require( './rules/no-contains' ),
		'no-context-prop': require( './rules/no-context-prop' ),
		'no-css': require( './rules/no-css' ),
		'no-data': require( './rules/no-data' ),
		'no-deferred': require( './rules/no-deferred' ),
		'no-delegate': require( './rules/no-delegate' ),
		'no-die': require( './rules/no-die' ),
		'no-each': require( './rules/no-each' ),
		'no-each-collection': require( './rules/no-each-collection' ),
		'no-each-util': require( './rules/no-each-util' ),
		'no-error': require( './rules/no-error' ),
		'no-error-shorthand': require( './rules/no-error-shorthand' ),
		'no-escape-selector': require( './rules/no-escape-selector' ),
		'no-event-shorthand': require( './rules/no-event-shorthand' ),
		'no-extend': require( './rules/no-extend' ),
		'no-fade': require( './rules/no-fade' ),
		'no-filter': require( './rules/no-filter' ),
		'no-find': require( './rules/no-find' ),
		'no-find-collection': require( './rules/no-find-collection' ),
		'no-find-util': require( './rules/no-find-util' ),
		'no-fx-interval': require( './rules/no-fx-interval' ),
		'no-global-eval': require( './rules/no-global-eval' ),
		'no-global-selector': require( './rules/no-global-selector' ),
		'no-grep': require( './rules/no-grep' ),
		'no-has': require( './rules/no-has' ),
		'no-hide': require( './rules/no-hide' ),
		'no-hold-ready': require( './rules/no-hold-ready' ),
		'no-html': require( './rules/no-html' ),
		'no-in-array': require( './rules/no-in-array' ),
		'no-is': require( './rules/no-is' ),
		'no-is-array': require( './rules/no-is-array' ),
		'no-is-empty-object': require( './rules/no-is-empty-object' ),
		'no-is-function': require( './rules/no-is-function' ),
		'no-is-numeric': require( './rules/no-is-numeric' ),
		'no-is-plain-object': require( './rules/no-is-plain-object' ),
		'no-is-window': require( './rules/no-is-window' ),
		'no-jquery-constructor': require( './rules/no-jquery-constructor' ),
		'no-live': require( './rules/no-live' ),
		'no-load': require( './rules/no-load' ),
		'no-load-shorthand': require( './rules/no-load-shorthand' ),
		'no-map': require( './rules/no-map' ),
		'no-map-collection': require( './rules/no-map-collection' ),
		'no-map-util': require( './rules/no-map-util' ),
		'no-merge': require( './rules/no-merge' ),
		'no-node-name': require( './rules/no-node-name' ),
		'no-noop': require( './rules/no-noop' ),
		'no-now': require( './rules/no-now' ),
		'no-on-ready': require( './rules/no-on-ready' ),
		'no-other-methods': require( './rules/no-other-methods' ),
		'no-other-utils': require( './rules/no-other-utils' ),
		'no-param': require( './rules/no-param' ),
		'no-parent': require( './rules/no-parent' ),
		'no-parents': require( './rules/no-parents' ),
		'no-parse-html': require( './rules/no-parse-html' ),
		'no-parse-html-literal': require( './rules/no-parse-html-literal' ),
		'no-parse-json': require( './rules/no-parse-json' ),
		'no-parse-xml': require( './rules/no-parse-xml' ),
		'no-prop': require( './rules/no-prop' ),
		'no-proxy': require( './rules/no-proxy' ),
		'no-ready': require( './rules/no-ready' ),
		'no-ready-shorthand': require( './rules/no-ready-shorthand' ),
		'no-selector-prop': require( './rules/no-selector-prop' ),
		'no-serialize': require( './rules/no-serialize' ),
		'no-show': require( './rules/no-show' ),
		'no-size': require( './rules/no-size' ),
		'no-sizzle': require( './rules/no-sizzle' ),
		'no-slide': require( './rules/no-slide' ),
		'no-sub': require( './rules/no-sub' ),
		'no-submit': require( './rules/no-submit' ),
		'no-support': require( './rules/no-support' ),
		'no-text': require( './rules/no-text' ),
		'no-toggle': require( './rules/no-toggle' ),
		'no-trigger': require( './rules/no-trigger' ),
		'no-trim': require( './rules/no-trim' ),
		'no-type': require( './rules/no-type' ),
		'no-unbind': require( './rules/no-unbind' ),
		'no-undelegate': require( './rules/no-undelegate' ),
		'no-unique': require( './rules/no-unique' ),
		'no-unload-shorthand': require( './rules/no-unload-shorthand' ),
		'no-val': require( './rules/no-val' ),
		'no-visibility': require( './rules/no-visibility' ),
		'no-when': require( './rules/no-when' ),
		'no-wrap': require( './rules/no-wrap' ),
		'variable-pattern': require( './rules/variable-pattern' )
	},
	configs: {
		recommended: {
			rules: {
				'no-jquery/variable-pattern': 'error'
			}
		},
		// Use this config if you are using jQuery slim build
		slim: {
			rules: {
				// Effects
				'no-jquery/no-animate': 'error',
				'no-jquery/no-animate-toggle': 'error',
				'no-jquery/no-fade': 'error',
				'no-jquery/no-slide': 'error',
				// Ajax
				'no-jquery/no-ajax': 'error',
				'no-jquery/no-ajax-events': 'error',
				'no-jquery/no-load': 'error',
				'no-jquery/no-parse-xml': 'error'
			}
		},
		// Use this config if you want to avoid all known deprecated jQuery tools.
		deprecated: {
			extends: 'plugin:no-jquery/deprecated-3.6'
		},
		// Use this config if you're writing code targetting jQuery 3.6.x environments.
		'deprecated-3.6': {
			extends: 'plugin:no-jquery/deprecated-3.5'
		},
		'deprecated-3.5': {
			extends: 'plugin:no-jquery/deprecated-3.4',
			rules: {
				// Pass empty options here to override options set in deprecated-3.3
				'no-jquery/no-event-shorthand': [ 'warn', {} ],
				'no-jquery/no-trim': 'warn'
			}
		},
		'deprecated-3.4': {
			extends: 'plugin:no-jquery/deprecated-3.3',
			rules: {
				'no-jquery/no-sizzle': [ 'warn', { allowPositional: false, allowOther: true } ]
			}
		},
		'deprecated-3.3': {
			extends: 'plugin:no-jquery/deprecated-3.2',
			rules: {
				'no-jquery/no-camel-case': 'warn',
				'no-jquery/no-event-shorthand': [ 'warn', { allowAjaxEvents: true } ],
				'no-jquery/no-is-function': 'warn',
				'no-jquery/no-is-numeric': 'warn',
				'no-jquery/no-is-window': 'warn',
				'no-jquery/no-now': 'warn',
				'no-jquery/no-proxy': 'warn',
				'no-jquery/no-type': 'warn'
			}
		},
		'deprecated-3.2': {
			extends: 'plugin:no-jquery/deprecated-3.1',
			rules: {
				'no-jquery/no-hold-ready': 'warn',
				'no-jquery/no-is-array': 'warn',
				'no-jquery/no-node-name': 'warn'
			}
		},
		'deprecated-3.1': {
			extends: 'plugin:no-jquery/deprecated-3.0'
		},
		'deprecated-3.0': {
			extends: 'plugin:no-jquery/deprecated-2.2',
			rules: {
				'no-jquery/no-bind': 'warn',
				'no-jquery/no-delegate': 'warn',
				'no-jquery/no-fx-interval': 'warn',
				'no-jquery/no-parse-json': 'warn',
				'no-jquery/no-ready-shorthand': 'warn',
				'no-jquery/no-unique': 'warn'
			}
		},
		'deprecated-2.2': {
			extends: 'plugin:no-jquery/deprecated-2.1'
		},
		'deprecated-2.1': {
			extends: 'plugin:no-jquery/deprecated-2.0'
		},
		'deprecated-2.0': {
			extends: 'plugin:no-jquery/deprecated-1.12'
		},
		'deprecated-1.12': {
			extends: 'plugin:no-jquery/deprecated-1.11'
		},
		'deprecated-1.11': {
			extends: 'plugin:no-jquery/deprecated-1.10'
		},
		'deprecated-1.10': {
			extends: 'plugin:no-jquery/deprecated-1.9',
			rules: {
				'no-jquery/no-context-prop': 'warn'
			}
		},
		'deprecated-1.9': {
			extends: 'plugin:no-jquery/deprecated-1.8',
			rules: {
				'no-jquery/no-support': 'warn'
			}
		},
		'deprecated-1.8': {
			extends: 'plugin:no-jquery/deprecated-1.7',
			rules: {
				'no-jquery/no-and-self': 'warn',
				// FIXME: `deferred.pipe()`
				'no-jquery/no-error-shorthand': 'warn',
				'no-jquery/no-load-shorthand': 'warn',
				'no-jquery/no-on-ready': 'warn',
				'no-jquery/no-size': 'warn',
				// FIXME: `$(...).toggle(fn,fn) (excluding https://api.jquery.com/toggle/)
				'no-jquery/no-unload-shorthand': 'warn'
			}
		},
		'deprecated-1.7': {
			extends: 'plugin:no-jquery/deprecated-1.6',
			rules: {
				// FIXME: `deferred.isRejected()/isResolved()`
				'no-jquery/no-live': 'warn',
				'no-jquery/no-sub': 'warn',
				'no-jquery/no-selector-prop': 'warn'
			}
		},
		'deprecated-1.6': {
			extends: 'plugin:no-jquery/deprecated-1.5'
		},
		'deprecated-1.5': {
			extends: 'plugin:no-jquery/deprecated-1.4'
		},
		'deprecated-1.4': {
			extends: 'plugin:no-jquery/deprecated-1.3'
		},
		'deprecated-1.3': {
			extends: 'plugin:no-jquery/deprecated-1.2',
			rules: {
				'no-jquery/no-box-model': 'warn',
				'no-jquery/no-browser': 'warn'
			}
		},
		'deprecated-1.2': {
			extends: 'plugin:no-jquery/deprecated-1.1'
		},
		'deprecated-1.1': {
			extends: 'plugin:no-jquery/deprecated-1.0'
		},
		'deprecated-1.0': {},
		// Use this config to disallow all usage of jQuery
		all: {
			rules: {
				'no-jquery/no-other-methods': 'warn',
				'no-jquery/no-other-utils': 'warn',
				'no-jquery/no-jquery-constructor': 'warn',

				// methods
				'no-jquery/no-animate': 'warn',
				'no-jquery/no-bind': 'warn',
				'no-jquery/no-class': 'warn',
				'no-jquery/no-closest': 'warn',
				'no-jquery/no-delegate': 'warn',
				'no-jquery/no-each-collection': 'warn',
				'no-jquery/no-event-shorthand': 'warn',
				'no-jquery/no-fade': 'warn',
				'no-jquery/no-find-collection': 'warn',
				'no-jquery/no-has': 'warn',
				'no-jquery/no-html': 'warn',
				'no-jquery/no-is': 'warn',
				'no-jquery/no-live': 'warn',
				'no-jquery/no-load': 'warn',
				'no-jquery/no-map-collection': 'warn',
				'no-jquery/no-parent': 'warn',
				'no-jquery/no-parents': 'warn',
				'no-jquery/no-ready-shorthand': 'warn',
				'no-jquery/no-serialize': 'warn',
				'no-jquery/no-size': 'warn',
				'no-jquery/no-slide': 'warn',
				'no-jquery/no-trigger': 'warn',
				'no-jquery/no-val': 'warn',
				'no-jquery/no-visibility': 'warn',
				'no-jquery/no-wrap': 'warn',

				// Utils
				'no-jquery/no-ajax': 'warn',
				'no-jquery/no-camel-case': 'warn',
				'no-jquery/no-contains': 'warn',
				'no-jquery/no-deferred': 'warn',
				'no-jquery/no-each-util': 'warn',
				'no-jquery/no-error': 'warn',
				'no-jquery/no-escape-selector': 'warn',
				'no-jquery/no-extend': 'warn',
				'no-jquery/no-find-util': 'warn',
				'no-jquery/no-global-eval': 'warn',
				'no-jquery/no-grep': 'warn',
				'no-jquery/no-hold-ready': 'warn',
				'no-jquery/no-in-array': 'warn',
				'no-jquery/no-is-array': 'warn',
				'no-jquery/no-is-empty-object': 'warn',
				'no-jquery/no-is-function': 'warn',
				'no-jquery/no-is-numeric': 'warn',
				'no-jquery/no-is-plain-object': 'warn',
				'no-jquery/no-is-window': 'warn',
				'no-jquery/no-map-util': 'warn',
				'no-jquery/no-merge': 'warn',
				'no-jquery/no-node-name': 'warn',
				'no-jquery/no-noop': 'warn',
				'no-jquery/no-now': 'warn',
				'no-jquery/no-param': 'warn',
				'no-jquery/no-parse-html': 'warn',
				'no-jquery/no-parse-json': 'warn',
				'no-jquery/no-parse-xml': 'warn',
				'no-jquery/no-proxy': 'warn',
				'no-jquery/no-trim': 'warn',
				'no-jquery/no-type': 'warn',
				'no-jquery/no-unique': 'warn',
				'no-jquery/no-when': 'warn',

				// Method+utils
				'no-jquery/no-attr': 'warn',
				'no-jquery/no-clone': 'warn',
				'no-jquery/no-css': 'warn',
				'no-jquery/no-data': 'warn',
				'no-jquery/no-filter': 'warn',
				'no-jquery/no-prop': 'warn',
				'no-jquery/no-sub': 'warn',
				'no-jquery/no-text': 'warn'

			}
		}
	}
};
