'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule(
	'submit',
	'Prefer `EventTarget#dispatchEvent` + `HTMLFormElement#submit` to `.submit`',
	{ deprecated: [ 'no-event-shorthand' ] }
);
