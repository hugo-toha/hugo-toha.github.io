'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createUtilMethodRule(
	'parseJSON',
	'Prefer `JSON.parse` to `$.parseJSON`',
	{
		fixable: 'code',
		fix: function ( node, context, fixer ) {
			return fixer.replaceText( node.callee, 'JSON.parse' );
		}
	}
);
