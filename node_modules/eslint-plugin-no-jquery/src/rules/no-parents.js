'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule(
	'parents',
	'Prefer `Element#closest` to `.parents`'
);
