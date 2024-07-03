'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createUtilPropertyRule(
	'noop',
	'Prefer `function(){}` to `$.noop`',
	{
		fixable: 'code',
		fix: function ( node, context, fixer ) {
			return fixer.replaceText( node, '(function(){})' );
		}
	}
);
