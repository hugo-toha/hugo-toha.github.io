'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule(
	'unbind',
	'Prefer `.off`/`EventTarget#removeEventListener` to `.unbind`',
	{ deprecated: [ 'no-bind' ] }
);
