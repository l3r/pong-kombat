function BluePaddle( ) {
	this.color = new Color( 33, 90, 255 );
	this.enum = "BLUE";
	this.name = "Blue Paddle";
	this.bigness = 3.00;
	this.quickness = 3.00;
	
	this.projectileSequence = [ Buttons.LEFT, Buttons.DOWN, Buttons.RIGHT, Buttons.ACTION ];
	this.dismantleSequence = [ Buttons.LEFT, Buttons.RIGHT, Buttons.DOWN, Buttons.ACTION ];
	
	this.endStory = "Shortly after their victory, Blue Paddle decides that the Pong Lao Tournament would make for an interesting video game. They spend entirely too much time making the game work with 3D television sets, and go bankrupt when the technology fails to succeed.";
	this.story = "Blue Paddle spends their days (and nights) alone behind the glow of a computer screen. After noticing a registration form for the tournament on Reddit, they decide to enter and attempt to prove they are more than just another nobody.";
	
	Paddle.call( this, 'Paddle-Blue' );
	this.icon = Resources['Paddle-Icon-Blue'];
	this.broken = Resources['Paddle-Broken-Blue'];
	
	this.effect = new ParticleSystem( );
	this.effect.particleImages = [Resources['Particle-Smoke1'],Resources['Particle-Smoke2']];
	this.effect.count = 20;
	this.effect.minVelocity.x = -this.size.x * 0.25;
	this.effect.minVelocity.y = this.size.y * 0.25;
	this.effect.maxVelocity.x = this.size.x * 0.25;
	this.effect.maxVelocity.y = -this.size.y * 0.25;
	this.effect.minParticleSize = this.size.x * 0.3;
	this.effect.maxParticleSize = this.size.x * 0.5;
	this.effect.minLife = 50;
	this.effect.maxLife = 200;
	this.effect.maxOpacity = 0.4;
	this.effect.rotationSpeed = 1;
	this.effect.scaleSpeed = 5;
	this.effect.attachTo( this );

	this.nameSound = new Sound( 'Blue-Paddle' );
	this.nameSound.setMaxVolume( 1 * app.settings.SOUND_FX / 11 );

	this.dismantleAnimationFrames = [
		// end = start?? call only once, end < 0?? call indefinitely
		{ start : 1.0, end : 1.0, action : function(winner) { winner.shootProjectile(); } },
		{ start : 1.0, end : 1.5, action : function(winner) { winner.moveDown(); winner.velocity.y *= 0.5; } },
		{ start : 1.25, end : 1.25, action : function(winner) { winner.shootProjectile(); } },
		{ start : 1.5, end : 1.5, action : function(winner) { winner.shootProjectile(); } },
		{ start : 1.5, end : 2.5, action : function(winner) { winner.moveUp(); winner.velocity.y *= 0.5; } },
		{ start : 1.75, end : 1.75, action : function(winner) { winner.shootProjectile(); } },
		{ start : 2.0, end : 2.0, action : function(winner) { winner.shootProjectile(); } },
		{ start : 2.25, end : 2.25, action : function(winner) { winner.shootProjectile(); } },
		{ start : 2.5, end : 2.5, action : function(winner) { winner.shootProjectile(); } },
		{ start : 2.5, end : 3.0, action : function(winner) { winner.moveDown(); winner.velocity.y *= 0.5; } },
		{ start : 2.75, end : 2.75, action : function(winner) { winner.shootProjectile(); } },
		{ start : 3.0, end : 3.0, action : function(winner) { winner.shootProjectile(); } },
		{
		  start : 3.0, end :  -1, action : function(winner) {
				if(winner.position.y != viewport.height / 2) {
					winner.moveUp();
				}
				if( winner.position.y < viewport.height / 2) {
					winner.position.y = viewport.height / 2;
					winner.velocity.y = 0;
				}
			}
		},
		{ start : 5.0, end : 8.0, action : function(winner, loser, percentComplete) { loser.dismantleFreezing(percentComplete); } },
		{ start : 8.0, end : 11.0, action : function(winner, loser, percentComplete) {
			if( loser.position.x < viewport.width * 0.5 ) {
				winner.position.x -= viewport.width * 0.06 * percentComplete;
			} else {
				winner.position.x += viewport.width * 0.06 * percentComplete;
			}
		} },
		{ start : 9.23, end : 9.23, action : function() {
			if( app.settings.SOUND_FX > 0 ) {
				var explodeSound = new Sound( 'Explode' );
				explodeSound.setMaxVolume( 1 * app.settings.SOUND_FX / 11 );
				explodeSound.play();
			}
		} },
		{ start : 9.23, end :  -1, action : function(winner, loser, percentComplete) { loser.dismantleExploding(percentComplete); } },
		{ start : 15.0, end : 15.0, action : function() { SceneManager.currentScene.changeState( SceneManager.currentScene.states.ending ); } }
	];
}

BluePaddle.prototype = new Paddle;
BluePaddle.prototype.constructor = BluePaddle;

BluePaddle.prototype.draw = function( context ) {
	Paddle.prototype.draw.call( this, context );
};

BluePaddle.prototype.shootProjectile = function( ) {
	var projectile = new IceBlastProjectile( this );
	Paddle.prototype.shootProjectile.call( this, projectile );

	projectile.effect.minVelocity.x -= projectile.velocity.x * 0.9;
	projectile.effect.maxVelocity.x += projectile.velocity.x * 0.9;
	projectile.effect.minVelocity.y -= projectile.velocity.y * 0.7;
	projectile.effect.maxVelocity.y += projectile.velocity.y * 0.7;
	
	if( app.settings.SOUND_FX > 0 ) {
		projectile.sound = new Sound( 'Whoosh-2' );
		projectile.sound.setMaxVolume( 0.5 * app.settings.SOUND_FX / 11 );
		projectile.sound.play();
	}
};

BluePaddle.prototype.update = function( deltaTime ) {
	Paddle.prototype.update.call( this, deltaTime );
};