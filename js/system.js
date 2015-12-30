// JavaScript Document
$(document).ready(function( ) { 
	'use strict';

	// @return {float} 		случайный коэфицент для изменения размера изображения
	var getRandomRatio 		= function( min , max ){ return Math.random() * ( max - min ) + min; }
	// @return {integer} 	случайно число от min до max
	var getRandomInteger 	= function (min, max) { return Math.round( min + Math.random() * (max - min) ); }
	//@return {bool} 		генерации буля для положения нового изображения выше(true) или ниже(false) предыдущего
	var getRandomRelative 	= function(){ return getRandomInteger( 0 , 1 ); }

	/**
	 * GLOBALS VARIABLES
	 */

	// Установочные параметры
	var _DEBUG_		= true; 				// Создавать ли переменные для дебага
	var _STARTY_	= -300; 					// Минимальное значение "y" откуда будут падать картинки
	var _STARTX_	= 50;					// Минимальное значение "х" откуда будут падать картинки
	var _RATIOMIN_	= 1.0;					// Минимальный коэфицент измнения размера изображения
	var _RATIOMAX_	= 1.5;					// Максимальные коэфицент изменения размера изображения
	var _$ELEMENTS_	= $('.th');				// JQuery селектор к которм будет привязана гравитация
	var _$PARENT_	= $('.back');
	var _$AREAELEM_ = $('#first-section');
	var _MARGIN_ 	= 3;					// Свободное пространство между элементами
	
	// Вычисляемые параметры, кэшируем их
	var _COUNTELEMENTS_	= _$ELEMENTS_.length;								// Вычисление количества элементров
	var _WIDTHWINDOW_ 	= $(window).width();								// Ширина окна
	var _LEFTINTERVAL_ 	= [ _STARTX_ , Math.floor( _WIDTHWINDOW_ / 2 ) ]; 	// Вычисление легово промежутка координат x 
	var _RIGHTINTERVAL_	= [ _LEFTINTERVAL_[ 1 ] , _WIDTHWINDOW_ ]; 			// Вычсиление правого промежутка кординат y
	var _COUNTLEFT_		= Math.floor( _COUNTELEMENTS_ / 2 );				// Количество элементов слева
	var _COUNTRIGHT_ 	= Math.ceil( _COUNTELEMENTS_ / 2 );					// Количество элементов справа
	var _PARENTHEIGHT_	= _$PARENT_.height();
	
	// Опции для плагина гравитации
	var gravity_options	= {
		gravity 		: { x:0 , y:1 } ,
		shape 			: 'circle' ,
		// containment 	: 'parent'		,
		containment 	: [
			15 							, // x1
			-300 						, // y1
			$(window).width()-15 			, // x2
			$('#first-section').offset().top + $('#first-section').height() 	, // y2
		]
	}

	var getTop = function( index , el_width , prev_pos , prev_height ){
		if( index == 0 || index == _COUNTLEFT_ ){ return _STARTY_ }
		var top;
		var relative = getRandomRelative();

		function toTop(){ return prev_pos.top - el_width - _MARGIN_; }
		function toBottom(){ return prev_pos.top + prev_height + _MARGIN_; }

		if ( relative ) {
			top = toTop();
			return ( top <= 0 ) ? toBottom() : top;
		} else {
			top = toBottom();
			return ( top + el_width >= _PARENTHEIGHT_ ) ? toTop() : top;
		}

	}

	var getLeft = function( index , el_width , prev_pos , prev_width ){
		if( index == 0 ){ return _STARTX_; } else if ( index == _COUNTLEFT_ ){ return _RIGHTINTERVAL_[0]; }
		var can_min = prev_pos.left;
		var can_max = prev_pos.left + prev_width;
		var left 	= getRandomInteger( can_min , can_max );

		return ( _WIDTHWINDOW_ <= left + el_width ) ? can_min : left;

		return left;
	}

	var putElement = function( $el , index ){
		var $prev 		= _$ELEMENTS_.eq( index - 1 );
		var prev_pos	= $prev.position();
		var prev_height = $prev.height();
		var new_width	= $el.width() * getRandomRatio( _RATIOMIN_ , _RATIOMAX_ );
		
		var top 		= getTop ( index , new_width , prev_pos , prev_height ) + 'px';
		var left 		= getLeft( index , new_width , prev_pos , prev_height ) + 'px';

		$el.css( { top : top , left : left  , width : new_width + 'px' } );
	}

	// Установка параметров для изображений левого края
	for( var i = 0; i < _COUNTELEMENTS_; i++ ){
		var $el;

		$el = _$ELEMENTS_.eq( i ); 
		putElement( $el , i );

		console.log('ELEMENT' , $el)
	}

	var tmp = 400;
	var parent_height 	= $('header').height() + $('#first-section').height() + $('footer').height();
	var parent_top 		= $('footer').height();
	_$PARENT_.css({
		height 	: '100%' ,
		// top 	: '-' + parent_top + 'px'
		// bottom : $('footer').height()
	});

	_$ELEMENTS_.throwable( gravity_options );

	/**
	 * _DEBUG_ variables
	 */
	if( _DEBUG_ ){
		window.random 			= getRandomRelative;
		window._LEFTINTERVAL_ 	= _LEFTINTERVAL_;
		window._RIGHTINTERVAL_	= _RIGHTINTERVAL_
		window._COUNTELEMENTS_ 	= _COUNTELEMENTS_;
	}
});