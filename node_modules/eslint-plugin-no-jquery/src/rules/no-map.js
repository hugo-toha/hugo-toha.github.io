'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionOrUtilMethodRule(
	'map',
	'Prefer `Array#map` to `.map`/`$.map`'
);
