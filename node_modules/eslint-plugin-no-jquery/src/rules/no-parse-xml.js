'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createUtilMethodRule(
	'parseXML',
	'Prefer `DOMParser#parseFromString` to `$.parseXML`',
	{
		fixable: 'code',
		fix: function ( node, context, fixer ) {
			if ( node.arguments.length ) {
				return [
					fixer.replaceText( node.callee, '( new window.DOMParser() ).parseFromString' ),
					fixer.insertTextAfterRange( node.arguments[ 0 ].range, ', "text/xml"' )
				];
			}
		}
	}
);
