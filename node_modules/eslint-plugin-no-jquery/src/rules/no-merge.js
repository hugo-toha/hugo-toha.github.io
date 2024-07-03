'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createUtilMethodRule(
	'merge',
	'Prefer `Array#concat` to `$.merge`'
);
