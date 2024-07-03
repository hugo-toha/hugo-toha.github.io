'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule(
	'parent',
	'Prefer `Node#parentElement` to `.parent`'
);
