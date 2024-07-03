'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createUtilMethodRule(
	'type',
	'Prefer `typeof`/`instanceof` to `$.type`'
);
