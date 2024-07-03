'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule(
	'ready',
	'Prefer `$()` to `.ready`',
	{
		fixable: 'code',
		fix: function ( node, context, fixer ) {
			if ( node.parent.type === 'ExpressionStatement' ) {
				return fixer.replaceText( node.callee, '$' );
			}
		}
	}
);
