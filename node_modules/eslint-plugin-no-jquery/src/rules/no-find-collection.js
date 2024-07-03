'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule(
	'find',
	'Prefer `Document#querySelectorAll` to `.find`'
);
