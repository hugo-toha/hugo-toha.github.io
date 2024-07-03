'use strict';

const utils = require( '../utils.js' );
const methods = [ 'append', 'prepend', 'before', 'after', 'replaceWith' ];

function alljQueryOrEmpty( context, node ) {
	if ( node.type === 'ConditionalExpression' ) {
		return alljQueryOrEmpty( context, node.consequent ) &&
			alljQueryOrEmpty( context, node.alternate );
	} else if ( node.type === 'Literal' ) {
		return node.value === null || (
			typeof node.value === 'string' && node.value.match( /^\s*$/ )
		);
	} else if ( node.type === 'Identifier' && node.name === 'undefined' ) {
		return true;
	} else {
		return utils.isjQuery( context, node );
	}
}

module.exports = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Disallows using ' + methods.map( utils.jQueryCollectionLink ).join( '/' ) +
			' to inject HTML, in order to prevent possible XSS bugs.'
		},
		schema: []
	},

	create: function ( context ) {
		return {
			'CallExpression:exit': function ( node ) {
				if ( !(
					node.callee.type === 'MemberExpression' &&
					methods.includes( node.callee.property.name )
				) ) {
					return;
				}
				if ( node.arguments.every( ( arg ) => alljQueryOrEmpty( context, arg ) ) ) {
					return;
				}

				if ( utils.isjQuery( context, node.callee ) ) {
					context.report( {
						node: node,
						message: 'Avoid injection of possibly unescaped HTML. Create DOM elements instead, or use .text.'
					} );
				}
			}
		};
	}
};
