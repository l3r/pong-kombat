var app;
var backBuffer = document.createElement( 'canvas' );
var viewport = document.createElement( 'canvas' );
var then = new Date( ).getTime( );

if( !( viewport.getContext && viewport.getContext( '2d' ) ) )
{
	// Unsupported Browsers
	window.location = "unsupported.html";
}
else
{
	var backBufferContext = backBuffer.getContext( '2d' );
	var viewportContext = viewport.getContext( '2d' );
}

function App( ) {
	this.aspectRatio = { x: 16, y: 9 };
	this.totalTime = 0;
	
	
	this.controls = false;
	this.framerate = 60;
	this.framerates = [ ];
	this.gameTime = 0;
	this.language = 'en_US';
	this.maxHeight = null;
	this.maxWidth = null;
	this.muted = false;
	this.paused = false;
	this.pauseMuted = false;
	this.resources = "/";
	this.startupScene = null;
	
	this.drawComponentBounds = false;
	this.drawSpriteBounds = false;
}

App.prototype.constructor = App;

App.prototype.confirm = function( message ) {
	return confirm( message );
};

App.prototype.getBrowserSize = function( ) {
	if( window.innerWidth != undefined )
	{
		return {
			height : window.innerHeight,
			width : window.innerWidth
		};
	}
	else
	{
		var body = document.body;
		var element = document.documentElement;
		
		return {
			height : Math.max( element.clientHeight, body.clientHeight ),
			width : Math.max( element.clientWidth, body.clientWidth )
		};
	}
};

App.prototype.hideControls = function( controlsToHide ) {
	if( this.controls )
	{
		if( controlsToHide instanceof Array )
		{
			for( var i = 0; i < controlsToHide.length; i++ )
			{
				document.getElementById( controlsToHide[i].toLowerCase( ) ).style.display = 'none';
			}
			
			return;
		}
		
		this.controls.style.display = "none";
	}
};

App.prototype.hideSocialMedia = function( ) {
	for( var i in this.social )
	{
		this.social[i].element.style.display = "none";
	}
};

App.prototype.initialize = function( ) {
	if( scriptsToLoad.length > 0 )
	{
		this.loading( );
		setTimeout( function( ) { app.initialize( ); }, 1000 );
		return this;
	}
	
	//document.body.appendChild( viewport );
	document.getElementById( 'play' ).appendChild( viewport );
	
	window.onblur = function( ) {
		app.paused = false;
		app.togglePause( );
	};
	
	window.oncontextmenu = function( event ) {
		event.stopPropagation( );
		return false;
	};
	
	window.onkeydown = function( input ) {
		InputManager.context = Keyboard;
		if( !InputManager.currentState[ Keyboard[ input.keyCode ] ] )
		{
			InputManager.currentState[ Keyboard[ input.keyCode ] ] = Date.now( );
		}
		clearTimeout( this.keySequenceTimer );
		if( Keyboard[ input.keyCode ] ) {
			input.preventDefault();
		}
	};
	
	this.keySequenceTimer = null;
	
	window.onkeyup = function( input ) {
		delete InputManager.currentState[ Keyboard[ input.keyCode ] ];
		if( InputManager.history.length > 10 ) {
			InputManager.history.splice( 0, InputManager.history.length - 10 );
		}
		InputManager.history.push( Keyboard[ input.keyCode ] );
		this.keySequenceTimer = setTimeout( function( ) {
			if( InputManager.history.length > 10 ) {
				InputManager.history.splice( 0, InputManager.history.length - 10 );
			}
			InputManager.history.push( '-' );
		}, 500 );
	};

	window.addEventListener( 'gamepadconnected', InputManager.handleGamepads );
	window.addEventListener( 'gamepaddisconnected', InputManager.handleGamepads );
	
	if( window.navigator.msPointerEnabled )
	{
		// MS Pointer Events (IE10+)
		window.addEventListener( 'MSPointerDown', InputManager.handlePointers, false );
		window.addEventListener( 'MSPointerMove', InputManager.handlePointers, false );
		window.addEventListener( 'MSPointerUp', InputManager.handlePointers, false );
		window.addEventListener( 'MSPointerCancel', InputManager.handlePointers, false );
		window.addEventListener( 'MSHoldVisual', function( e ) { e.preventDefault( ); }, false ); // disable visual indicator
		
		if( typeof viewport.style.msContentZooming != 'undefined' )
		{
			viewport.style.msContentZooming = 'none';
		}
		
		if( typeof viewport.style.msTouchAction != 'undefined' )
		{
			viewport.style.msTouchAction = 'none';
		}
	}
	else
	{
		// iOS Touch Events
		window.ontouchstart = InputManager.handleTouch;
		window.ontouchmove = InputManager.handleTouch;
		window.ontouchend = InputManager.handleTouch;
		window.ontouchcancel = InputManager.handleTouch;
		
		// Standard Mouse Events
		viewport.onmousedown = function( input ) {
			input.preventDefault( );
			InputManager.context = Mouse;
			InputManager.currentState[ Mouse[ input.which ] ] = Date.now( );
			InputManager.mouse.x = input.clientX - viewport.offsetLeft;
			InputManager.mouse.y = input.clientY - viewport.offsetTop;
		};
		
		viewport.onmousemove = function( input ) {
			InputManager.mouse.x = input.clientX - viewport.offsetLeft;
			InputManager.mouse.y = input.clientY - viewport.offsetTop;
		};
		
		window.onmouseup = function( input ) {
			delete InputManager.currentState[ Mouse[ input.which ] ];
		};
	}
	
	this.showControls( );
	this.hideControls( );
	this.resize( );
	
	// Needs to be reworked in order to get scene objects to scale based on this
	// Currently just refresh the app when resizing
	window.onresize = function( ) { window.location = window.location; };

	SceneManager.changeScene( this.startupScene );
	requestAnimationFrame( this.render );
};

App.prototype.isMobile = function( ) {
	return (
		navigator.userAgent.match( /Android/i ) ||
		navigator.userAgent.match( /BlackBerry/i ) ||
		navigator.userAgent.match( /iPhone|iPad|iPod/i ) ||
		navigator.userAgent.match( /Opera Mini/i ) ||
		navigator.userAgent.match( /IEMobile/i ) ||
		navigator.userAgent.match( /MSIE.*Touch/i )
	);
};

App.prototype.loading = function( ) {
	var loading = document.getElementById( 'loading' )
	if( loading == null )
	{
		loading = document.createElement( 'div' );
		loading.id = "loading";
		document.body.appendChild( loading );
	}
	
	loading.textContent = ResourceManager.loadedCount + ' / ' + ResourceManager.totalCount;
};

App.prototype.log = function( ) {
	if( typeof console.log == 'function' )
	{
		console.log.apply( console, arguments );
	}
};

App.prototype.render = function( ) {
	requestAnimationFrame( app.render );
	
	var now = new Date( ).getTime( );
	var delta = now - then;
	then = now;

	InputManager.handleGamepads( );
	
	// Clear canvas
	viewportContext.clearRect( 0, 0, viewport.width, viewport.height );
	
	if( !app.paused )
	{	
		// Update objects
		app.gameTime += delta;
		if( delta < 1000 ) { // trying to avoid: first render cycle is like 2+ seconds, for some reason
			SceneManager.update( delta / 1000 ); // Use s instead of ms for update calls
		}
	}
	else if( InputManager.checkButtonPress( Buttons.ACTION ) || InputManager.checkButtonPress( Buttons.BACK ) )
	{
		app.togglePause( );
	}
	
	InputManager.previousState = copy( InputManager.currentState );
	
	// Draw scene
	SceneManager.draw( viewportContext );
	
	if( app.paused )
	{
		viewportContext.save( );
		viewportContext.fillStyle = "rgba( 0, 0, 0, 0.67 )";
		viewportContext.fillRect( 0, 0, viewport.width, viewport.height );
		viewportContext.restore( );
	}
};
	
App.prototype.resize = function( ) {
	var browser = this.getBrowserSize( );
	
	// Auto-scale and center the viewport, based on aspect ratio and max sizes
	if( browser.width / browser.height < this.aspectRatio.x / this.aspectRatio.y )
	{
		viewport.width = browser.width;
		viewport.height = viewport.width / this.aspectRatio.x * this.aspectRatio.y;
	}
	else if( browser.width / browser.height > this.aspectRatio.x / this.aspectRatio.y )
	{
		viewport.height = browser.height;
		viewport.width = viewport.height / this.aspectRatio.y * this.aspectRatio.x;
	}
	else
	{
		viewport.height = browser.height;
		viewport.width = browser.width;
	}
	
	if( this.maxHeight > 0 && viewport.height > this.maxHeight )
	{
		viewport.height = this.maxHeight;
		viewport.width = this.maxHeight / this.aspectRatio.y * this.aspectRatio.x;
	}
	
	if( this.maxWidth > 0 && viewport.width > this.maxWidth )
	{
		viewport.width = this.maxWidth;
		viewport.height = this.maxWidth / this.aspectRatio.x * this.aspectRatio.y;
	}

	/*
	if( browser.width > 1000 || browser.height > 500 ) {
		// Use CSS scaling for large monitors to help optimize processing
		// TODO: only do this if framerate drops? use a in-game "detail" setting
		viewport.style.marginTop = -( viewport.height / 2 ) + "px";
		viewport.style.marginLeft = -( viewport.width / 2 ) + "px";
		viewport.style.width = viewport.width + 'px';
		viewport.style.height = viewport.height + 'px';
		viewport.width /= 2;
		viewport.height /= 2;
		viewport.center = { x : viewport.width / 2, y : viewport.height / 2 };
	} else {
	*/
		viewport.center = { x : viewport.width / 2, y : viewport.height / 2 };
		viewport.style.marginTop = -( viewport.height / 2 ) + "px";
		viewport.style.marginLeft = -( viewport.width / 2 ) + "px";
	/*
	}
	*/
	
	backBuffer.width = viewport.width;
	backBuffer.height = viewport.height;
	
	if( this.controls )
	{
		var scale;
		if( this.maxHeight )
		{
			scale = viewport.height / this.maxHeight;
		}
		else if( this.maxWidth )
		{
			scale = viewport.width / this.maxWidth;
		}
		
		this.controls.style.fontSize = Math.floor( scale * 100 ) + "%";
		this.controls.style.marginTop = viewport.style.marginTop;
		this.controls.style.marginLeft = viewport.style.marginLeft;
		this.controls.style.width = viewport.width + "px";
		this.controls.style.height = viewport.height + "px";
	}
};

App.prototype.showControls = function( ) {
	if( this.controls )
	{
		var controls = this.controls.getElementsByTagName( 'button' );
		for( var i = 0; i < controls.length; i++ )
		{
			controls[i].style.display = "block";
		}
		
		this.controls.style.display = "block";
		return;
	}
	
	this.controls = document.createElement( 'div' );
	this.controls.id = "controls";
	this.controls.style.marginTop = viewport.style.marginTop;
	this.controls.style.marginLeft = viewport.style.marginLeft;
	this.controls.style.width = viewport.width + "px";
	this.controls.style.height = viewport.height + "px";
	
	for( var button in Buttons )
	{
		if( Buttons.hasOwnProperty( button ) )
		{
			var btnElement = document.createElement( 'button' );
			btnElement.appendChild( document.createTextNode( button ) );
			btnElement.id = button.toLowerCase( );
			
			btnElement.onmousedown = 
			btnElement.ontouchstart = function( input ) {
				InputManager.context = Keyboard;
				InputManager.currentState[ Buttons[ this.id.toUpperCase( ) ] ] = Date.now( );
			};
			
			btnElement.onmouseup =
			btnElement.onmouseout = 
			btnElement.ontouchend = function( input ) {
				delete InputManager.currentState[ Buttons[ this.id.toUpperCase( ) ] ];
			};
			
			this.controls.appendChild( btnElement );
		}
	}
	
	document.body.appendChild( this.controls );
};

App.prototype.setMobileAudio = function( resource ) {
	if( this.isMobile( ) )
	{
		app.mobileAudio.src = app.resources + resource + app.mobileAudio.getAttribute( 'data-format' );
	}
};

App.prototype.toggleMute = function( ) {
	if( app.paused )
	{
		return;
	}
	
	app.muted = !app.muted;
	
	if( app.muted )
	{
		AudioManager.mute( );
	}
	else
	{
		AudioManager.unmute( );
	}

	if( app.controls )
	{
		document.getElementById( 'mute' ).className = ( app.muted ) ? "muted" : "";
	}
};

App.prototype.togglePause = function( ) {
	app.paused = !app.paused;
	
	/*
	if( app.paused && !app.muted )
	{
		AudioManager.mute( );
		app.pauseMuted = true;
	}
	else if( !app.paused && app.pauseMuted )
	{
		app.pauseMuted = false;
		AudioManager.unmute( );
	}
	*/
};

copy = function( source ) {
	var duplicate = { };
	
	for( property in source )
	{
		if( typeof source[property] == 'source' )
		{
			duplicate[property] = this.clone( source[property] );
		}
		else
		{
			duplicate[property] = source[property];
		}
	}
	
	return duplicate;
};