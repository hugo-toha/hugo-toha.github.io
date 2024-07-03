'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule(
	'map',
	'Prefer `Array#map` to `.map`'
);
