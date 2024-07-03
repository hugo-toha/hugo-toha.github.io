'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule(
	[ 'slideDown', 'slideToggle', 'slideUp' ],
	( node ) => node === true ?
		'Prefer CSS transitions' :
		`Prefer CSS transitions to .${node.callee.property.name}`
);
