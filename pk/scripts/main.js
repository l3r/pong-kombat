load( "pk/scripts/", [
	"player",
	"opponent",
	"ball",
	"projectile",
	"menu",
	"menus/title-menu",
	"menus/pause-menu",
	"level",
	"levels/default-background",
	"levels/default-foreground",
	"levels/forest-background",
	"levels/forest-foreground",
	"levels/hell-background",
	"levels/hell-foreground",
	"levels/highway-background",
	"levels/highway-foreground",
	"levels/ice-river-background",
	"levels/ice-river-foreground",
	"levels/pit-background",
	"levels/pit-foreground",
	"levels/portal-background",
	"levels/portal-foreground",
	"levels/storm-background",
	"levels/storm-foreground",
	"levels/tower-background",
	"levels/tower-foreground",
	"levels/toxic-pool-background",
	"levels/toxic-pool-foreground",
	"paddle",
	"paddles/yellow-paddle",
	"paddles/blue-paddle",
	"paddles/green-paddle",
	"paddles/red-paddle",
	"paddles/purple-paddle",
	"paddles/shifter-paddle",
	"paddles/monolith-paddle",
	"paddles/white-paddle",
	"powerup",
	"powerups/speed-powerup",
	"other/stackblur",
	//"other/fastblur",
	
	"scenes/splash-scene",
	"scenes/title-scene",
	"scenes/choose-paddle-scene",
	"scenes/kombat-scene",
	"scenes/tournament-scene",
	"scenes/story-scene",
	"scenes/help-scene",
	
	"scenes/kombat-layer",
	"scenes/hud-layer"
] );

window.onload = ready;

function ready( ) {
	if( scriptsToLoad.length > 0 )
	{
		setTimeout( ready, 500 );
		return;
	}
	
	app = new App( );
	app.aspectRatio = { x : 1 + Math.sqrt( 5 ), y : 2 };
	app.resources = "pk/";
	app.settings = {
		censored : true,
		sound_fx : true
	};
	if( window.lang !== undefined )
	{
		app.language = window.lang;
	}
	//app.setMobileAudio( "audio/background-music" );
	app.resize( );
	
	var loadingInterval;
	var loadingTick = function( ) {
	};
	
	app.loading = function( ) {
		if( loadingInterval == null )
		{
			loadingTick( );
			loadingInterval = setInterval( loadingTick, 100 );
		}
	};
	
	ResourceManager.addJSON( 'Assets', 'scripts/assets.js' );
	ResourceManager.addJSON( 'Localization', 'locales/' + app.language + '.js' );
	
	ResourceManager.onLoaded = function( ) {
		clearInterval( loadingInterval );
		app.startupScene = new TitleScene( );
		app.initialize( );
	};
};