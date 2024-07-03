'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule(
	[ 'show', 'hide', 'toggle' ],
	( node ) => node === true ? '' :
		`.${node.callee.property.name} is not allowed`
);
