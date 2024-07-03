'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule(
	'closest',
	'Prefer `Element#closest` to `.closest`'
);
