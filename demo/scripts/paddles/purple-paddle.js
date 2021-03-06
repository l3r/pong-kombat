function PurplePaddle( ) {
	this.color = new Color( 255, 0, 255 );
	this.enum = "PURPLE";
	this.name = "Purple Paddle";
	this.bigness = 3.50;
	this.quickness = 4.00;

	this.projectileSequence = [ Buttons.UP, Buttons.RIGHT, Buttons.DOWN, Buttons.ACTION ];
	this.dismantleSequence = [ Buttons.RIGHT, Buttons.DOWN, Buttons.LEFT, Buttons.ACTION ];
	
	this.endStory = "purple end story";
	this.story = "purple story";
	
	Paddle.call( this, 'Paddle-Purple' );
	
	this.effect = new ParticleSystem( );
	this.effect.particleImages = [Resources['Particle-Lightning1'],Resources['Particle-Lightning2'],Resources['Particle-Lightning3']];
	this.effect.count = 50;
	this.effect.minVelocity.x = 0;
	this.effect.minVelocity.y = 0;
	this.effect.maxVelocity.x = 0;
	this.effect.maxVelocity.y = 0;
	this.effect.minParticleSize = this.size.x * 1.25;
	this.effect.maxParticleSize = this.size.x * 1.5;
	this.effect.minLife = 40;
	this.effect.maxLife = 200;
	this.effect.maxOpacity = 0.7;
	this.effect.rotationSpeed = 0;
	this.effect.scaleSpeed = 0;
	this.effect.fadeSpeed = 0.65;
	
	this.effect.draw = function( context ) {
		context.save( );
		context.globalCompositeOperation = this.compositeOperation;
		
		for(var i = 0; i < this.particles.length; i++)
		{
			var p = this.particles[i];
			
			context.save();
			context.globalAlpha = p.opacity;
			if( this.attachedObject ) {
				context.translate( this.attachedObject.position.x + p.position.x - p.startPosition.x, this.addatchedObject.position.y + p.position.y - p.startPosition.y );
			} else {
				context.translate( this.position.x + p.position.x - p.startPosition.x, this.position.y + p.position.y - p.startPosition.y );
			}
			context.rotate( p.rotation );
			context.drawImage( p.image, -p.radius * p.scale, -p.radius * p.scale, p.radius * 2 * p.scale, p.radius * 2 * p.scale );
			context.restore();
		}
		context.restore( );
	};
	
	this.boltCanvas = document.createElement( 'canvas' );
	this.boltCanvas.width = ( this.image ) ? this.image.width : 512;
	this.boltCanvas.height = ( this.image ) ? this.image.height : 512;
	this.boltContext = this.boltCanvas.getContext( '2d' );
	
	this.bolt = this.boltContext.createPattern( this.image, 'repeat' );
	this.bolt.maxLife = 100;
	this.bolt.life = 0;
}

PurplePaddle.prototype = new Paddle;
PurplePaddle.prototype.constructor = PurplePaddle;

PurplePaddle.prototype.dismantle = function( opponent ) {
	var sceneTime = opponent.layer.scene.stateTime;
	
	if( sceneTime < 2 ) {
	} else if( sceneTime < 5 ) {
		this.velocity.x = viewport.width * ( sceneTime - 2 / 100 );
	}
};

PurplePaddle.prototype.draw = function( context ) {
	Paddle.prototype.draw.call( this, context );
	
	var width = this.size.x * this.scale;
	var height = this.size.y * this.scale;
	var x = -width * this.registration.x;
	var y = -height * this.registration.y;
	var radius = width * 0.50;
	
	if(this.bolt.life <= 0) {
		this.boltContext.save( );
		this.boltContext.translate( -this.offset * this.boltCanvas.width, 0 );
		this.boltContext.fillStyle = this.bolt;
		this.boltContext.fillRect( -this.boltCanvas.width, -this.boltCanvas.height, this.boltCanvas.width * 2, this.boltCanvas.height * 2 );
		this.boltContext.restore( );
		
		this.bolt.life = Math.random() * this.bolt.maxLife;
	}
	
	context.save();
	context.globalCompositeOperation = 'lighter';
	context.globalAlpha = this.opacity * 0.5;
	context.translate( this.position.x, this.position.y );
	context.rotate( this.rotation * Math.TO_RADIANS );
	context.beginPath();
	context.moveTo(x + radius, y);
	context.lineTo(x + width - radius, y);
	context.quadraticCurveTo(x + width, y, x + width, y + radius);
	context.lineTo(x + width, y + height - radius);
	context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	context.lineTo(x + radius, y + height);
	context.quadraticCurveTo(x, y + height, x, y + height - radius);
	context.lineTo(x, y + radius);
	context.quadraticCurveTo(x, y, x + radius, y);
	context.closePath();
	context.clip();
	context.drawImage(
		this.boltCanvas,
		0,
		0,
		this.boltCanvas.width * (this.size.x / this.size.y) * 0.75,
		this.boltCanvas.height * 0.75,
		-width * this.registration.x,
		-height * this.registration.y,
		width,
		height
	);
	context.restore();
	
	this.effect.draw( context );
};


PurplePaddle.prototype.shootProjectile = function( ) {
	Paddle.prototype.shootProjectile.call( this );
	//this.projectile.tint = this.color;
};

PurplePaddle.prototype.update = function( deltaTime ) {
	Paddle.prototype.update.call( this, deltaTime );
	this.velocity = this.velocity.multiply( 0.9 );
	
	this.bolt.life -= 1;
	
	this.effect.position = this.position;
	this.effect.rotation = this.rotation;
	this.effect.size.x = this.size.x * this.scale;
	this.effect.size.y = this.size.y * this.scale;
	this.effect.scale = this.scale;
	this.effect.update( deltaTime );
};