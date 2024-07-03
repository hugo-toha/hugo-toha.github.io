'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule(
	'is',
	'Prefer `Element#matches` to `.is`'
);
