'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionOrUtilMethodRule(
	'filter',
	'Prefer `Array#filter` to `.filter`/`$.filter`'
);
