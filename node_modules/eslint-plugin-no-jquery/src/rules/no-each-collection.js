'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule(
	'each',
	'Prefer `Array#forEach` to `.each`'
);
