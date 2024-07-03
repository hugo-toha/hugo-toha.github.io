'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule(
	[ 'delegate', 'undelegate' ],
	( node ) => node === true ?
		'Prefer `.on`/`.off` or `EventTarget#addEventListener`/`removeEventListener`' : (
			node.callee.property.name === 'delegate' ?
				'Prefer .on/EventTarget#addEventListener to .delegate' :
				'Prefer .off/EventTarget#removeEventListener to .undelegate'
		)
);
