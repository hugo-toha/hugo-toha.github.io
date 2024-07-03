'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createUtilMethodRule(
	'param',
	'Prefer `FormData` or `URLSearchParams` to `$.param`'
);
