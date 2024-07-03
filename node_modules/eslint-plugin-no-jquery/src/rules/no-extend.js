'use strict';

const utils = require( '../utils.js' );

module.exports = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Disallows the ' + utils.jQueryGlobalLink( 'extend' ) + ' utility. Prefer `Object.assign` or the spread operator.'
		},
		schema: [
			{
				type: 'object',
				properties: {
					allowDeep: {
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
				if ( node.callee.type !== 'MemberExpression' ) {
					return;
				}
				const name = node.callee.property.name;
				if (
					name !== 'extend' ||
					!utils.isjQueryConstructor( context, node.callee.object.name )
				) {
					return;
				}
				const allowDeep = context.options[ 0 ] && context.options[ 0 ].allowDeep;
				if (
					allowDeep &&
					node.arguments[ 0 ] && node.arguments[ 0 ].value === true
				) {
					return;
				}

				context.report( {
					node: node,
					message: 'Prefer Object.assign or the spread operator to $.extend'
				} );
			}
		};
	}
};
