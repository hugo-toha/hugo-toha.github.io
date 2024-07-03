'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createUtilMethodRule(
	'proxy',
	'Prefer `Function#bind` to `$.proxy`',
	{
		fixable: 'code',
		fix: function ( node, context, fixer ) {
			if (
				node.arguments.length >= 2 &&
				node.arguments[ 1 ].type !== 'Literal'
			) {
				const fnText = context.getSourceCode().getText( node.arguments[ 0 ] );
				return [
					fixer.replaceText( node.callee, fnText + '.bind' ),
					fixer.removeRange( [
						node.arguments[ 0 ].range[ 0 ],
						node.arguments[ 1 ].range[ 0 ]
					] )
				];
			}
		}
	}
);
