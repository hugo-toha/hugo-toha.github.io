'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionOrUtilMethodRule(
	'clone',
	'Prefer `Node#cloneNode` to `.clone`/`$.clone`'
);
