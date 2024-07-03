'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule( 'hide', '', { deprecated: [ 'no-visibility' ] } );
