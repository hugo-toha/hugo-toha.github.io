'use strict';

const utils = require( '../utils.js' );

module.exports = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Disallows ' + utils.jQueryCollectionLink( 'hasClass' ) +
			' and ' + utils.jQueryCollectionLink( 'toggleClass' ) +
			' to discourage querying the DOM for state information. ' +
			utils.jQueryCollectionLink( 'toggleClass' ) + ' may be used with a boolean argument as then it behaves like ' +
			utils.jQueryCollectionLink( 'addClass' ) + '/' + utils.jQueryCollectionLink( 'removeClass' ) + '.'
		},
		schema: []
	},

	create: function ( context ) {
		return {
			'CallExpression:exit': function ( node ) {
				if ( !(
					node.callee.type === 'MemberExpression' && (
						node.callee.property.name === 'hasClass' ||
						// toggleClass with one argument will check if the
						// class is already in the DOM before deciding what to do,
						// so it is equivalent to using hasClass.
						(
							node.callee.property.name === 'toggleClass' &&
							node.arguments.length === 1
						)
					)
				) ) {
					return;
				}

				if ( utils.isjQuery( context, node.callee ) ) {
					context.report( {
						node: node,
						message: 'Where possible, maintain application state in JS to avoid slower DOM queries'
					} );
				}
			}
		};
	}
};
