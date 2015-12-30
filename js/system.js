// JavaScript Document
$(document).ready(function( ) { 
	'use strict';

	// @return {float} 		случайный коэфицент для изменения размера изображения
	var getRandomRatio 		= function( min , max ){ return Math.random() * ( max - min ) + min; }
	// @return {integer} 	случайно число от min до max
	var getRandomInteger 	= function (min, max) { return Math.round( min + Math.random() * (max - min) ); }
	//@return {bool} 		генерации буля для положения нового изображения выше(true) или ниже(false) предыдущего
	var getRandomRelative 	= function(){ return getRandomInteger( 0 , 1 ); }

	var getTop = function( index , el_width , prev_pos , prev_height ){
		if( index == 0 || index == _COUNTLEFT_ ){ return _STARTY_ }
		return ( getRandomRelative() ) ? prev_pos.top - el_width - _MARGIN_ : prev_pos.top + prev_height + _MARGIN_;
	}

	var getLeft = function( index , el_width , prev_pos , prev_width ){
		if( index == 0 ){ return _STARTX_; } else if ( index == _COUNTLEFT_ ){ return _RIGHTINTERVAL_[0]; }
		var can_min = prev_pos.left;
		var can_max = prev_pos.left + prev_width;
		var left 	= getRandomInteger( can_min , can_max );

		return ( _WIDTHWINDOW_ <= left + el_width ) ? can_min : left;
	}

	var putElement = function( $el , index ){
		var $prev 		= _$ELEMENTS_.eq( index - 1 );
		var prev_pos	= $prev.position();
		var prev_height = $prev.height();
		var new_width	= $el.width() * getRandomRatio( _RATIOMIN_ , _RATIOMAX_ );
		
		var top 		= getTop ( index , new_width , prev_pos , prev_height ) + 'px';
		var left 		= getLeft( index , new_width , prev_pos , prev_height ) + 'px';

		$el.css( { top : top , left : left  , width : new_width + 'px' } );
		$el.find( 'img' ).width( new_width );
	}

	/**
	 * @param  {IMG ELEMENT}
	 * @return {void} вставляет после body новые элемент <div class="th"><img src="..." /></div>
	 */
	var createGravityElement = function( Image ){
		var Before , Div;
		Before = Div = null;

		Div 			= document.createElement( 'div' );
		Div.className 	= 'th';
		Div.appendChild( Image );
		document.body.insertBefore( Div , Before );
	}

	// Загрузив шаблон на сервер, изображения не хотят скачиваться
	// поэтому создаем функцию для ожидания загрузки изображений
	function preloadImages(srcs, imgs, callback) {
	    var img;
	    var remaining = srcs.length;
	    for (var i = 0; i < srcs.length; i++) {
	        img = new Image();
	        img.onload = function() {
	            --remaining;
	            if (remaining <= 0) {
	                callback();
	            }
	        };
	        img.src = srcs[i];
	        imgs.push(img);
	    }
	}
	
	/**
	 * GLOBALS VARIABLES
	 */

	// Установочные параметры
	// then to call it, you would use this
	var _IMAGESRCS_ = [ 					// Массив с изображениями которые необходимо будет подгрузить
		"images/stats/stat-01.png" ,
		"images/stats/stat-02.png" ,
		"images/stats/stat-03.png" ,
		"images/stats/stat-04.png" ,
		"images/stats/stat-05.png" ,
		"images/stats/stat-06.png" ,
		"images/stats/stat-07.png" ,
		"images/stats/stat-08.png" ,
		"images/stats/stat-09.png" ,
		"images/stats/stat-10.png" ,
		"images/stats/stat-11.png" ,
		"images/stats/stat-12.png" ,
		"images/stats/stat-13.png" ,
		"images/stats/stat-14.png" ,
		"images/stats/stat-15.png"
	];
	var _LOADEDIMAGES_ = [];				// Массив загруженных изображений

	var _DEBUG_		= true; 				// Создавать ли переменные для дебага
	var _STARTY_	= -200; 				// Минимальное значение "y" откуда будут падать картинки
	var _STARTX_	= 50;					// Минимальное значение "х" откуда будут падать картинки
	var _RATIOMIN_	= 1.0;					// Минимальный коэфицент измнения размера изображения
	var _RATIOMAX_	= 1.5;					// Максимальные коэфицент изменения размера изображения
	var _ELEMENTS_ 	= '.th'					// К какому селектору применять гравитацию
	var _$ELEMENTS_	= {}					// JQuery селектор к которм будет привязана гравитация
	var _$AREAELEM_ = $('#first-section');	// Элемент вниз которого будут ложиться элементы
	var _MARGIN_ 	= 3;					// Свободное пространство между элементами
	
	// Вычисляемые параметры, кэшируем их
	var _COUNTELEMENTS_	= _IMAGESRCS_.length;								// Вычисление количества элементров
	var _WIDTHWINDOW_ 	= $(window).width();								// Ширина окна
	var _LEFTINTERVAL_ 	= [ _STARTX_ , Math.floor( _WIDTHWINDOW_ / 2 ) ]; 	// Вычисление легово промежутка координат x 
	var _RIGHTINTERVAL_	= [ _LEFTINTERVAL_[ 1 ] , _WIDTHWINDOW_ ]; 			// Вычсиление правого промежутка кординат y
	var _COUNTLEFT_		= Math.floor( _COUNTELEMENTS_ / 2 );				// Количество элементов слева
	var _COUNTRIGHT_ 	= Math.ceil( _COUNTELEMENTS_ / 2 );					// Количество элементов справа
	
	// Опции для плагина гравитации
	var _GRAVITY_		= {
		gravity 		: { x:0 , y:1 } ,
		shape 			: 'circle' ,
		containment 	: [
			15 												, // x1
			_STARTY_ + ( -400 )								, // y1
			_WIDTHWINDOW_ - 15 								, // x2
			_$AREAELEM_.offset().top + _$AREAELEM_.height() , // y2
		]
	}

	// !!!!! INITIALIZE !!!!!
	// Вначале загружаем все изображения
	preloadImages(_IMAGESRCS_, _LOADEDIMAGES_, function(){
		// Вставляем загруженные изображения в dom
		for( var i = 0; i < _COUNTELEMENTS_; i++ ){
			createGravityElement( _LOADEDIMAGES_[ i ] );
		}

		// Делаем новые выборку элементов
		_$ELEMENTS_	= $( _ELEMENTS_ );
		
		// Расставляем элементы
		for( var i = 0; i < _COUNTELEMENTS_; i++ ){
			var $el = _$ELEMENTS_.eq( i );
			putElement( $el , i );
		}

		// Инициализируем гравитацию
		_$ELEMENTS_.throwable( _GRAVITY_ );
	});

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