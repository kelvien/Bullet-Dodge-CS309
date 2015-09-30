var myId=0;

var land;

var plane;
var player;
var planeList;
var roomList;

var cursors;

var bullets;
var guest;

var ready = false;




function preload () {

    game.load.atlas('tank', 'assets/tanks.png', 'assets/tanks.json');
    game.load.atlas('enemy', 'assets/enemy-tanks.png', 'assets/tanks.json');
    game.load.image('logo', 'assets/logo.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('earth', 'assets/scorched_earth.png');
    game.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64, 23);
    
}


Plane = function (index, game, player) {
    this.cursor = {
        left:false,
        right:false,
        up:false,
        down:false    
    }

    this.input = {
        left:false,
        right:false,
        up:false,
        down:false
    }

    var x = -30;
    var y = -30;

    this.game = game;

    this.player = player;
    
    this.currentSpeed =0;

    this.alive = true;

    this.plane = game.add.sprite(x, y, 'enemy', 'tank1');

    this.plane.anchor.set(0.5);

    this.plane.id = index;
    game.physics.enable(this.plane, Phaser.Physics.ARCADE);
    this.plane.body.immovable = false;
    this.plane.body.collideWorldBounds = true;
    this.plane.body.bounce.setTo(0, 0);


};

Plane.prototype.update = function() {
    
    var inputChanged = (
        this.cursor.left != this.input.left ||
        this.cursor.right != this.input.right ||
        this.cursor.up != this.input.up ||
        this.cursor.down != this.input.down
    );
    
    
    if (inputChanged)
    {
        //Handle input change here
        //send new values to the server     
        if (this.plane.id == myId)
        {
            // send latest valid state to the server
            this.input.x = this.plane.x;
            this.input.y = this.plane.y;
            
            
            eurecaServer.handleKeys(this.input);
            
        }
    }

    //cursor value is now updated by eurecaClient.exports.updateState method
    
    if (this.cursor.left)
    {
        this.plane.x -=3;
    }
    else if (this.cursor.right)
    {
        this.plane.x += 3
    }   
    if (this.cursor.up)
    {
        //  The speed we'll travel at
        this.plane.y -= 3;
    }
    else if(this.cursor.down)
    {
        this.plane.y += 3;
    }
    
    
    
};

Plane.prototype.kill = function()
{
    this.alive = false;
    this.plane.kill();
}



function create () {

	//  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(0, 0, 800, 600);
    game.stage.disableVisibilityChange  = true;
    
    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, 800, 600, 'earth');
    land.fixedToCamera = true;

    player = new Plane(myId, game, plane);
    planeList = {};
    roomList = {};
    roomList[currentroom] = planeList;
    roomList[currentroom][myId] = player;
    plane = player.plane;
    if(myId == currentroom)
    {
        plane.x = 100;
        plane.y = 300;
    }
    else
    {
        plane.x = 600;
        plane.y = 300;
        guest = myId;
    }

    plane.bringToTop();

    cursors = game.input.keyboard.createCursorKeys();

    
}

function update () {

    if(!ready) return;

    //console.log('update!');

    roomList[currentroom][myId].input.left = cursors.left.isDown;
    roomList[currentroom][myId].input.right = cursors.right.isDown;
    roomList[currentroom][myId].input.up = cursors.up.isDown;
    roomList[currentroom][myId].input.down = cursors.down.isDown;



    for(var r in roomList)
    {
        for(var i in roomList[r])
        {
            if(!roomList[r][i]) continue;

            roomList[r][i].update();
        }
    }



	
}



function render () {}

