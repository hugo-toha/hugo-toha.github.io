'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionOrUtilMethodRule(
	[ 'attr', 'removeAttr' ],
	( node ) => node === true ?
		'Prefer `Element#getAttribute`/`setAttribute`/`removeAttribute`' :
		'Prefer Element#' +
		(
			node.callee.property.name === 'removeAttr' ? 'removeAttribute' :
				node.arguments.length === 2 ? 'setAttribute' : 'getAttribute'
		) +
		' to .' + node.callee.property.name + '/$.' + node.callee.property.name
);
