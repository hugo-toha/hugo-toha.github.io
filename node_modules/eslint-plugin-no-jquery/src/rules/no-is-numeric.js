'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createUtilMethodRule(
	'isNumeric',
	'Prefer `typeof` to `$.isNumeric`'
);
