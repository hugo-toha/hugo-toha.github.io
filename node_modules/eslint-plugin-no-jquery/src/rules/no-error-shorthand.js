'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule(
	'error',
	'Prefer `.on` or `.trigger` to `.error`',
	{
		fixable: 'code',
		fix: utils.eventShorthandFixer
	}
);
