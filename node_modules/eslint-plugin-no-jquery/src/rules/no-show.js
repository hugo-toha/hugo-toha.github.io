'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule( 'show', '', { deprecated: [ 'no-visibility' ] } );
