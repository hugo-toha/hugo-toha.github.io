'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createUtilMethodRule(
	'isArray',
	'Prefer `Array.isArray` to `$.isArray`',
	{
		fixable: 'code',
		fix: function ( node, context, fixer ) {
			return fixer.replaceText( node.callee, 'Array.isArray' );
		}
	}
);
