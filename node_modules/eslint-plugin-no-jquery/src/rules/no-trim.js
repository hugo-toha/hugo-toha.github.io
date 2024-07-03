'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createUtilMethodRule(
	'trim',
	'Prefer `String#trim` to `$.trim`'
);
