'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule(
	'die',
	'Prefer `.off`/`EventTarget#removeEventListener` to `.die`',
	{ deprecated: [ 'no-live' ] }
);
