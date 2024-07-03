'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule(
	'undelegate',
	'Prefer `.off`/`EventTarget#removeEventListener` to `.undelegate`',
	{ deprecated: [ 'no-delegate' ] }
);
