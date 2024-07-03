'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule(
	[ 'live', 'die' ],
	( node ) => node === true ?
		'Prefer `.on`/`.off` or `EventTarget#addEventListener`/`removeEventListener`' : (
			node.callee.property.name === 'live' ?
				'Prefer .on/EventTarget#addEventListener to .live' :
				'Prefer .off/EventTarget#removeEventListener to .die'
		)
);
