'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionOrUtilMethodRule(
	'find',
	'Prefer `Document#querySelectorAll` to `.find`/`$.find`'
);
