'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createUtilMethodRule(
	'isFunction',
	'Prefer `typeof` to `$.isFunction`',
	{
		fixable: 'code',
		fix: function ( node, context, fixer ) {
			const calleeRange = node.callee.range;
			return [
				fixer.replaceTextRange( [ calleeRange[ 0 ], calleeRange[ 1 ] + 1 ], 'typeof ' ),
				fixer.replaceTextRange( [ node.range[ 1 ] - 1, node.range[ 1 ] ], ' === "function"' )
			];
		}
	}
);
