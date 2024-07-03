'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createUtilMethodRule(
	'each',
	'Prefer `Array#forEach` to `$.each`'
);
