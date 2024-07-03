'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionOrUtilMethodRule(
	[ 'prop', 'removeProp' ],
	( node ) => node === true ?
		'Prefer direct property access' :
		`Prefer direct property access to .${node.callee.property.name}/$.${node.callee.property.name}`
);
