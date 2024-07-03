'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createUtilMethodRule(
	[ 'ajax', 'get', 'getJSON', 'getScript', 'post' ],
	( node ) => node === true ?
		'Prefer `Window.fetch`' :
		`Prefer Window.fetch to $.${node.callee.property.name}`
);
