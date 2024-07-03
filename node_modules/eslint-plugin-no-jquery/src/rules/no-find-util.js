'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createUtilMethodRule(
	'find',
	'Prefer `Document#querySelectorAll` to `$.find`'
);
