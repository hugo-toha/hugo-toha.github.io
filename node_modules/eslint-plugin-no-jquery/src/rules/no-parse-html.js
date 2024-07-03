'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createUtilMethodRule(
	'parseHTML',
	'Prefer `DOMImplementation#createHTMLDocument` to `$.parseHTML`'
);
