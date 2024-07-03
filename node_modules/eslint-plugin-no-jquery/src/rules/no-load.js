'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule(
	'load',
	'Prefer `fetch` to `.load`'
);
