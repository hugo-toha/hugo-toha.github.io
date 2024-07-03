'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionOrUtilMethodRule(
	'text',
	'Prefer `Node#textContent` to `.text`/`$.text`'
);
