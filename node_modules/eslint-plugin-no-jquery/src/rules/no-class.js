'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule(
	[ 'addClass', 'hasClass', 'removeClass', 'toggleClass' ],
	( node ) => node === true ?
		'Prefer `Element#classList`' :
		`Prefer Element#classList to .${node.callee.property.name}`
);
