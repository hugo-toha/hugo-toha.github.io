'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule(
	'val',
	'Prefer `HTMLInputElement#value` to `.val`'
);
