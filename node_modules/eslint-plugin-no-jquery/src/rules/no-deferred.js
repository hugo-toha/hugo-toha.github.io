'use strict';

const utils = require( '../utils.js' );

module.exports = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Disallows ' + utils.jQueryGlobalLink( 'Deferred' ) + ' constructor. Prefer `Promise`.'
		},
		schema: []
	},

	create: function ( context ) {
		function enforce( node ) {
			if (
				node.callee.type !== 'MemberExpression' ||
				!utils.isjQueryConstructor( context, node.callee.object.name ) ||
				node.callee.property.name !== 'Deferred'
			) {
				return;
			}

			context.report( {
				node: node,
				message: 'Prefer Promise to $.Deferred'
			} );
		}

		return {
			'CallExpression:exit': enforce,
			NewExpression: enforce
		};
	}
};
