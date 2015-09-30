var myId=0;

var land;

var shadow;
var tank;
var turret;
var player;
var tanksList;
var explosions;

var logo;


var cursors;

var bullets;
var fireRate = 100;
var nextFire = 0;

var ready = false;

//this function will handle client communication with the server



Tank = function (index, game, player) {
	this.cursor = {
		left:false,
		right:false,
		up:false,
		fire:false,
		down:false		
	}


    var x = 0;
    var y = 0;

    this.game = game;
	
	
	this.currentSpeed =0;
    this.alive = true;

    this.tank = game.add.sprite(x, y, 'enemy', 'tank1');

    this.tank.anchor.set(0.5);
 
    this.tank.id = index;
    game.physics.enable(this.tank, Phaser.Physics.ARCADE);
    this.tank.body.immovable = false;
    this.tank.body.collideWorldBounds = true;
    this.tank.body.bounce.setTo(0, 0);


};

Tank.prototype.update = function() {

	//cursor value is now updated by eurecaClient.exports.updateState method

	
    if (this.cursor.left)
    {
        this.tank.x -=3;
    }
    else if (this.cursor.right)
    {
        this.tank.x += 3
    }	
    if (this.cursor.up)
    {
        //  The speed we'll travel at
        this.tank.y -= 3;
    }
    else if(this.cursor.down)
    {
        this.tank.y += 3;
    }
	
	

	
	
	
};



Tank.prototype.kill = function() {
	this.alive = false;
	this.tank.kill();
}



function preload () {

    game.load.atlas('tank', 'assets/tanks.png', 'assets/tanks.json');
    game.load.atlas('enemy', 'assets/enemy-tanks.png', 'assets/tanks.json');
    game.load.image('logo', 'assets/logo.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('earth', 'assets/scorched_earth.png');
    game.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64, 23);
    
}



function create () {

    //  Resize our game world to be a 2000 x 2000 square
 //   game.world.setBounds(-1000, -1000, 2000, 2000);
	game.stage.disableVisibilityChange  = true;
	
    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, 800, 600, 'earth');
    land.fixedToCamera = true;
    
    tanksList = {};
	
	player = new Tank(myId, game, tank);
	tanksList[myId] = player;
	tank = player.tank;
	tank.x=0;
	tank.y=0;

  
    tank.bringToTop();
		
    logo = game.add.sprite(0, 200, 'logo');
    logo.fixedToCamera = true;

    game.input.onDown.add(removeLogo, this);

    game.camera.follow(tank);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);

    cursors = game.input.keyboard.createCursorKeys();
	
	setTimeout(removeLogo, 1000);
	
}

function removeLogo () {
    game.input.onDown.remove(removeLogo, this);
    logo.kill();
}

function update () {
	//do not update if client not ready
	if (!ready) return;
	
	player.input.left = cursors.left.isDown;
	player.input.right = cursors.right.isDown;
	player.input.up = cursors.up.isDown;
	player.input.down = cursors.down.isDown;
	player.input.tx = game.input.x+ game.camera.x;
	player.input.ty = game.input.y+ game.camera.y;
	
	
    land.tilePosition.x = -game.camera.x;
    land.tilePosition.y = -game.camera.y;

    	
	
    for (var i in tanksList)
    {
		if (!tanksList[i]) continue;
		var curTank = tanksList[i].tank;
		for (var j in tanksList)
		{
			
			if (tanksList[j].alive)
			{
				tanksList[j].update();
			}			
		}
    }
}



function render () {}

