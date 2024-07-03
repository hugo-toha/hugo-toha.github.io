'use strict';

const utils = require( '../utils.js' );

module.exports = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Disallows ' + utils.jQueryGlobalLink( 'fx.interval' ) + '.'
		},
		schema: []
	},

	create: function ( context ) {
		return {
			MemberExpression: function ( node ) {
				if (
					!utils.isjQueryConstructor( context, node.object.name ) ||
					node.property.name !== 'fx' ||
					!node.parent.property ||
					node.parent.property.name !== 'interval'
				) {
					return;
				}

				context.report( {
					node: node,
					message: '$.fx.interval is not allowed'
				} );
			}
		};
	}
};
