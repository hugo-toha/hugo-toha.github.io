'use strict';

const utils = require( '../utils.js' );

module.exports = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Disallows the jQuery constructor `$()`.'
		},
		schema: []
	},

	create: function ( context ) {
		return {
			'CallExpression:exit': function ( node ) {
				if (
					node.callee.type !== 'Identifier' ||
					!utils.isjQueryConstructor( context, node.callee.name )
				) {
					return;
				}

				context.report( {
					node: node,
					message: 'The jQuery constructor is not allowed'
				} );
			}
		};
	}
};
