'use strict';

const utils = require( '../utils.js' );

// HTML regex (modified from jQuery)
const rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;
// ID patterns that return one DOM node
const idPattern = /^#[^>~\s]+$/;

module.exports = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Disallows global selectors which search the whole document. ' +
			'Encourages users to keep references to DOM nodes in memory, instead of selecting them from the DOM each time. ' +
			'Use the `allowIds` option to allow single ID selectors.'
		},
		schema: [
			{
				type: 'object',
				properties: {
					allowIds: {
						type: 'boolean'
					}
				},
				additionalProperties: false
			}
		]
	},

	create: function ( context ) {
		return {
			'CallExpression:exit': function ( node ) {
				if (
					node.callee.type !== 'Identifier' ||
					!utils.isjQueryConstructor( context, node.callee.name ) ||
					!node.arguments[ 0 ] ||
					node.arguments[ 0 ].type !== 'Literal'
				) {
					return;
				}
				const value = node.arguments[ 0 ].value;
				const allowIds = context.options[ 0 ] && context.options[ 0 ].allowIds;
				if (
					typeof value !== 'string' ||
					!value ||
					value === '#' ||
					( allowIds && idPattern.test( value.trim() ) )
				) {
					return;
				}

				// Simple HTML check (copied from jQuery)
				if (
					value[ 0 ] === '<' &&
					value[ value.length - 1 ] === '>' &&
					value.length >= 3
				) {
					return;
				}
				if ( rquickExpr.exec( value ) ) {
					return;
				}

				const selectorContext = node.arguments[ 1 ];
				if ( selectorContext ) {
					if (
						selectorContext.type !== 'Literal' &&
						!(
							selectorContext.type === 'Identifier' &&
							selectorContext.name === 'undefined'
						)
					) {
						return;
					}
					if ( selectorContext.value === '#' ) {
						return;
					}
				}

				context.report( {
					node: node,
					message: 'Avoid queries which search the entire DOM. Keep DOM nodes in memory where possible.'
				} );
			}
		};
	}
};
