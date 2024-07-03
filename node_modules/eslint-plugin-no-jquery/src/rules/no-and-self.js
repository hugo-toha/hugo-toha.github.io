'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule(
	'andSelf',
	'Prefer `.addBack` to `.andSelf`',
	{
		fixable: 'code',
		fix: function ( node, context, fixer ) {
			return fixer.replaceText( node.callee.property, 'addBack' );
		}
	}
);
