'use strict';

const utils = require( '../utils.js' );

module.exports = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Disallows passing attributes to the jQuery constructor. Prefer `.attr`.'
		},
		schema: []
	},

	create: function ( context ) {
		return {
			'CallExpression:exit': function ( node ) {
				if ( node.callee.type === 'MemberExpression' ) {
					if ( !(
						node.callee.property.name === 'add' &&
						utils.isjQuery( context, node.callee ) &&
						node.arguments[ 1 ] &&
						node.arguments[ 1 ].type === 'ObjectExpression'
					) ) {
						return;
					}
				} else if ( node.callee.type === 'Identifier' ) {
					if ( !(
						utils.isjQueryConstructor( context, node.callee.name ) &&
						node.arguments[ 1 ] &&
						node.arguments[ 1 ].type === 'ObjectExpression'
					) ) {
						return;
					}
				} else {
					return;
				}

				context.report( {
					node: node,
					message: 'Prefer .attr to constructor attributes'
				} );
			}
		};
	}
};
