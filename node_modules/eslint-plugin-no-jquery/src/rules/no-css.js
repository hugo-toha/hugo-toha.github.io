'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionOrUtilMethodRule(
	'css',
	'Prefer `Window#getComputedStyle` to `.css`/`$.css`'
);
