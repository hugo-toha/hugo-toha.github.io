'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule(
	'html',
	'Prefer `Element#innerHTML` to `.html`',
	{ getAndSetOptions: true }
);
