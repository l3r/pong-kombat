function TitleScene( ) {
	Scene.call( this );
	
	if( Resources['Localization'].UseRTL == "true" )
	{
		document.body.style.direction = "rtl";
	}
	
	this.titleText = new Text( Resources['Localization'].Title );
	this.titleText.color = "#FFE8B8";
	this.titleText.fontFamily = "'Apple Garamond'";
	this.titleText.fontSize = viewport.height * 0.11;
	this.titleText.fontStyle = "200";
	this.titleText.position.x = viewport.width * 0.5;
	this.titleText.position.y = viewport.height * 0.5;
	this.titleText.textAlign = "center";
}

TitleScene.prototype = new Scene;
TitleScene.prototype.constructor = TitleScene;

TitleScene.prototype.draw = function( context ) {
	this.titleText.draw( context );
	
	if( this.layers['Menu'] ) {
		this.layers['Menu'].draw( context );
	}
};

TitleScene.prototype.update = function( deltaTime ) {
	Scene.prototype.update.call( this, deltaTime );
	
	if( !this.layers['Menu'] && InputManager.checkButtonPress( Buttons.ACTION ) )
	{
		this.addLayer( 'Menu', new TitleMenu( this ) );
	}
	
	if( !this.layers['Menu'] && this.timeElapsed > 5 ) {
		var storyScene = new StoryScene( );
		storyScene.setPaddle( Paddles.RANDOM );
		storyScene.setStory( 'background' );
		SceneManager.changeScene( storyScene, Transitions.NONE );
	}
};