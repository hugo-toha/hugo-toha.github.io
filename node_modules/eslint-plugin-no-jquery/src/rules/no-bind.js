'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule(
	[ 'bind', 'unbind' ],
	( node ) => node === true ?
		'Prefer `.on`/`.off` or `EventTarget#addEventListener`/`removeEventListener`' : (
			node.callee.property.name === 'bind' ?
				'Prefer .on/EventTarget#addEventListener to .bind' :
				'Prefer .off/EventTarget#removeEventListener to .unbind'
		)
);
