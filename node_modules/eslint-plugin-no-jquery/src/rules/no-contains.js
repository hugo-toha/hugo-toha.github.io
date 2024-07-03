'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createUtilMethodRule(
	'contains',
	'Prefer `Node#contains` to `$.contains`'
);
