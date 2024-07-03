'use strict';

const utils = require( '../utils.js' );

module.exports = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Disallows the [`.load`](https://api.jquery.com/load-event/) method when used as a shorthand for `.on( \'load\', function )` or `.trigger( \'load\' )`. Prefer `.on` or `.trigger`.'
		},
		fixable: 'code',
		schema: []
	},

	create: function ( context ) {
		return {
			'CallExpression:exit': function ( node ) {
				if ( !(
					node.callee.type === 'MemberExpression' &&
					!utils.isjQueryConstructor( context, node.callee.object.name ) &&
					node.callee.property.name === 'load' && (
						node.arguments.length === 0 ||
						utils.isFunction( node.arguments[ 0 ] )
					)
				) ) {
					return;
				}

				if ( utils.isjQuery( context, node.callee ) ) {
					context.report( {
						node: node,
						message: 'Prefer .on or .trigger to .load',
						fix: utils.eventShorthandFixer.bind( this, node, context )
					} );
				}
			}
		};
	}
};
