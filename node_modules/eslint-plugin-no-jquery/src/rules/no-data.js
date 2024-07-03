'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionOrUtilMethodRule(
	[ 'data', 'removeData', 'hasData' ],
	( node ) => node === true ?
		'Prefer `WeakMap`' :
		`Prefer WeakMap to .${node.callee.property.name}/$.${node.callee.property.name}`
);
