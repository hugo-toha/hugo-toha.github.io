'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule(
	[ 'serialize', 'serializeArray' ],
	( node ) => node === true ?
		'Prefer `FormData` or `URLSearchParams`' :
		`Prefer FormData or URLSearchParams to .${node.callee.property.name}`
);
