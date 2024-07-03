'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createUtilMethodRule(
	'grep',
	'Prefer `Array#filter` to `$.grep`'
);
