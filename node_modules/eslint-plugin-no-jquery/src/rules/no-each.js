'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionOrUtilMethodRule(
	'each',
	'Prefer `Array#forEach` to `.each`/`$.each`'
);
