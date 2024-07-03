'use strict';

const utils = require( '../utils.js' );

// $(function(){})
function isDirect( context, node ) {
	return (
		node.callee.type === 'Identifier' &&
		utils.isjQueryConstructor( context, node.callee.name ) &&
		node.arguments[ 0 ] &&
		utils.isFunction( node.arguments[ 0 ] )
	);
}

// $(document).ready()
function isChained( context, node ) {
	return (
		node.callee.type === 'MemberExpression' &&
		node.callee.property.name === 'ready' &&
		utils.isjQuery( context, node )
	);
}

module.exports = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Disallows the document ready event, either `$( function() {} )` or `$( document ).ready()`.'
		},
		schema: []
	},

	create: function ( context ) {
		return {
			'CallExpression:exit': function ( node ) {
				if ( isDirect( context, node ) || isChained( context, node ) ) {
					context.report( {
						node: node,
						message: '.ready is not allowed'
					} );
				}
			}
		};
	}
};
