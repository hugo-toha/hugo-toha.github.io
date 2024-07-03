'use strict';

const utils = require( '../utils.js' );

const methodsWithRules = [
	'addClass',
	'ajaxComplete',
	'ajaxError',
	'ajaxSend',
	'ajaxStart',
	'ajaxStop',
	'ajaxSuccess',
	'animate',
	'attr',
	'bind',
	'blur',
	'change',
	'click',
	'clone',
	'closest',
	'contextmenu',
	'css',
	'data',
	'dblclick',
	'delegate',
	'die',
	'each',
	'fadeIn',
	'fadeOut',
	'fadeTo',
	'fadeToggle',
	'filter',
	'find',
	'focus',
	'focusin',
	'focusout',
	'has',
	'hasClass',
	'hide',
	'hover',
	'html',
	'is',
	'keydown',
	'keypress',
	'keyup',
	'live',
	'load',
	'map',
	'mousedown',
	'mouseenter',
	'mouseleave',
	'mousemove',
	'mouseout',
	'mouseover',
	'mouseup',
	'parent',
	'parents',
	'prop',
	'ready',
	'removeAttr',
	'removeClass',
	'removeData',
	'removeProp',
	'resize',
	'scroll',
	'select',
	'serialize',
	'serializeArray',
	'show',
	'size',
	'slideDown',
	'slideToggle',
	'slideUp',
	'submit',
	'text',
	'toggle',
	'toggleClass',
	'trigger',
	'unbind',
	'undelegate',
	'unwrap',
	'val',
	'wrap',
	'wrapAll',
	'wrapInner'
];

module.exports = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Disallows all methods not covered by more specific rules.'
		},
		schema: []
	},

	create: function ( context ) {
		return {
			'CallExpression:exit': function ( node ) {
				if ( node.callee.type !== 'MemberExpression' ) {
					return;
				}
				const name = node.callee.property.name;
				if (
					!name ||
					methodsWithRules.includes( name ) ||
					utils.isjQueryConstructor( context, node.callee.object.name )
				) {
					return;
				}
				if ( utils.isjQuery( context, node.callee ) ) {
					context.report( {
						node: node,
						message: '.{{name}} is not allowed',
						data: { name: name }
					} );
				}
			}
		};
	}
};
