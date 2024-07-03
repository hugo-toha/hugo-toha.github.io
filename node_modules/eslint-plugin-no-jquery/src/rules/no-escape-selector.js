'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createUtilMethodRule(
	'escapeSelector',
	'Prefer `CSS.escape` to `$.escapeSelector`',
	{
		fixable: 'code',
		fix: function ( node, context, fixer ) {
			return fixer.replaceText( node.callee, 'CSS.escape' );
		}
	}
);
