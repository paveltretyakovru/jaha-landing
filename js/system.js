// JavaScript Document
$(document).ready(function( ) { 
	'use strict';
	var starty 		= 50; 
	var startx 		= -100;
	var $elements	= $('.th');

	$elements.each( function( index , el ) {
		var $el = $( el );
		var y 	= starty * index;
		var w 	= $el.width() * ( Math.random() + 0.5 ); 
		var x 	= startx + w;

		$el.width( w );
		el.style.left	= y + 'px' ;
		el.style.top 	= x + 'px' ;

	});

	$elements.throwable({
		gravity 		:{x:0,y:1} ,
		containment 	: "parent" ,
		shape 			: 'circle'
	});

});