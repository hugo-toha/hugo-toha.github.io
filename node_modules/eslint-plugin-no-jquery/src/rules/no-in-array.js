'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createUtilMethodRule(
	'inArray',
	'Prefer `Array#indexOf` to `$.inArray`'
);
