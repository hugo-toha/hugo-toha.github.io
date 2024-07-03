'use strict';

const utils = require( '../utils.js' );

module.exports = utils.createCollectionMethodRule( 'toggle', '', { deprecated: [ 'no-visibility' ] } );
