var myId=0; //current user's id

var land; //background

var plane; //plane
var player; //player information include plane
var planeList; //list of planes for other rooms
var roomList; //list of rooms 

var cursors; //left,right,up,down cursor information

var guest;

var ready = false; //if user ready or not

var bullets;  //groups of bullet
var nextFire = 0; //bullet can shoot after this time period
var fireRate = 800; //how fast the bullet shoot

var started = false; //game is not started yet

var turret1; //turret at lett top corner
var turret2;
var turret3;
var turret4;
var turret5;
var turret6;
var turret7;
var turret8; // turret at left middle
var sturret; // current selected turret
var score; //game score


var itemexist;
var star;
var invinc;
var invictime;

var rapid = 0;

var itemStart;
var itemtime;
var itemdelay = 7;
var nextItem = itemdelay;


//load image before create game
function preload () {

    //game.load.atlas('tank', 'attackdefend/assets/tanks.png', 'assets/tanks.json');
    //game.load.atlas('enemy', 'attackdefend/assets/enemy-tanks.png', 'assets/tanks.json');
    game.load.image('plane', 'attackdefend/assets/new/player2.png');
    game.load.image('bullet', 'attackdefend/assets/new/laserBlue02.png');
    game.load.image('earth', 'attackdefend/assets/new/background.png');
    game.load.image('star', 'attackdefend/assets/new/star_gold.png');
    game.load.image('shield', 'attackdefend/assets/new/player.png');
    game.load.image('bullet2', 'attackdefend/assets/new/laserRed02.png');
    game.load.image('turret', 'attackdefend/assets/new/turret.png');
    
}

//plane class
Plane = function (index, game, player) {
    // synchronize cursor and input
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

    //set startingpoint
    var x = 380;
    var y = 300;

    //initialize variables
    this.game = game;

    this.player = player;
    
    this.currentSpeed =0;

    this.alive = true;

    this.plane = game.add.sprite(x, y, 'plane');

    this.plane.anchor.set(0.5);

    this.plane.id = index;
    game.physics.enable(this.plane, Phaser.Physics.ARCADE);
    //body can move
    this.plane.body.immovable = false;
    //body cannot go through boundary
    this.plane.body.collideWorldBounds = true;
    this.plane.body.bounce.setTo(0, 0);


};

//update plane
Plane.prototype.update = function() {
    
    //check if there is input change
    var inputChanged = (
        this.cursor.left != this.input.left ||
        this.cursor.right != this.input.right ||
        this.cursor.up != this.input.up ||
        this.cursor.down != this.input.down
    );
    
    //when there is a change 
    if (inputChanged)
    {
      
        if (this.plane.id == myId)
        {
           
            this.input.x = this.plane.x;
            this.input.y = this.plane.y;
            
             // send latest valid state to the server
            eurecaServer.handleKeys(this.input);
            
        }
    }

    //cursor value is now updated by eurecaClient.exports.updateState method
    

    //plane moves 3px every updates (speed of plane)
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
        
        this.plane.y -= 3;
    }
    else if(this.cursor.down)
    {
        this.plane.y += 3;
    }
    
    
    
};

//delete plane
Plane.prototype.kill = function()
{
    this.alive = false;
    this.plane.kill();
}


//create game board
function create () {

    game.physics.startSystem(Phaser.Physics.ARCADE);
	//  Resize our game world to be a 800 x 600 square
    game.world.setBounds(0, 0, 800, 600);
    game.stage.disableVisibilityChange  = true;
    
    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, 800, 600, 'earth');
    
    //fix camera at same position
    land.fixedToCamera = true;


    //initialize plane list
    planeList = {};
    //initialize room list
    roomList = {};
    //add plane list to room list
    roomList[currentroom] = planeList;

    //if current user is a host
    if(myId == currentroom)
    {
        //creates plane
        player = new Plane(myId, game, plane);
      
        roomList[currentroom][myId] = player;
        plane = player.plane;
        plane.x = 380;
        plane.y = 300;
        plane.bringToTop();

        game.physics.enable(roomList[currentroom][myId], Phaser.Physics.ARCADE);
    }
   
    //creates turret
    turret1 = game.add.sprite(0,0,'turret');
    turret2 = game.add.sprite(369,0, 'turret');
    turret3 = game.add.sprite(737,0,'turret');
    turret4 = game.add.sprite(737,269,'turret');
    turret5 = game.add.sprite(737,537,'turret');
    turret6 = game.add.sprite(369,537,'turret');
    turret7 = game.add.sprite(0,537,'turret');
    turret8 = game.add.sprite(0,269,'turret');


    //set turret's starting angle
    
    /*
    turret1.angle = 45;
    turret2.angle = 90;
    turret3.angle = 135;
    turret4.angle = 180;
    turret5.angle = 225;
    turret6.angle = 270;
    turret7.angle = 315;
    turret8.angle = 0;
    */

    //current selected turret
    sturret = 1;


    itemexist = 0;
    invinc = 0;
    invictime = 3;
    itemtime = 0;

    itemStart = 0;

    cursors = game.input.keyboard.createCursorKeys();

    

    //create bullet

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet', 0, false); //30 is limitation of bullet
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);


    
}


//fire bullet
function fire (turret) {
    //x value of turret
    var tx=0;
    //y value of turret
    var ty=0;


    //when delay of fire is passed
    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        //calculate next delay of fire
        nextFire = game.time.now + fireRate;

        //creates bullet
        var bullet = bullets.getFirstExists(false);

        //set tx & ty to selected turret
        switch(turret)
        {
            case 1:
                tx = turret1.x;
                ty = turret1.y;
                break;
            case 2:
                tx = turret2.x;
                ty = turret2.y;
                break;
            case 3:
                tx = turret3.x;
                ty = turret3.y;
                break;
            case 4:
                tx = turret4.x;
                ty = turret4.y;
                break;
            case 5:
                tx = turret5.x;
                ty = turret5.y;
                break;
            case 6:
                tx = turret6.x;
                ty = turret6.y;
                break;
            case 7:
                tx = turret7.x;
                ty = turret7.y;
                break;
            case 8:
                tx = turret8.x;
                ty = turret8.y;
                break;
        }
        
        //move bullet to turret position
        bullet.reset(tx+31, ty+31)

        //current mouse pointer
        var po = game.input.activePointer;


        //move bullet to current mouse pointer's x & y
        bullet.rotation = game.physics.arcade.moveToXY(bullet, po.x, po.y, 800, 500);


        //tells server that opponent can see bullet
         eurecaServer.handleBullet(tx+31, ty+31, po.x, po.y, currentroom);
    }

}

//loop updates in game
function update () {

    //if people is not ready does not start game loop
    if(!ready) return;

        itemtime = parseInt(parseFloat(Math.round(game.time.totalElapsedSeconds() * 100) / 100).toFixed(0));
        if(itemtime > 0 && itemtime > nextItem && itemexist == 0 && myId != currentroom)
        {
            x = Math.floor((Math.random() * 700) + 1);
            y = Math.floor((Math.random() * 500) + 1);
           eurecaServer.handleItem(x, y, "star", currentroom);
           star = game.add.sprite( x, y ,'star');
           game.physics.enable(star, Phaser.Physics.ARCADE);
           itemexist = 1;
           
        }
        if(invinc == 1)
        {
            
            if(parseInt(itemStart) < itemtime)
            {
                console.log(itemStart, itemtime);
                invinc = 0;
                itemexist = 0;
                roomList[currentroom][currentroom].plane.loadTexture('plane');
            }
            
            
        }

        if(rapid == 1)
        {
            
            if(parseInt(itemStart) < itemtime)
            {
                console.log(itemStart, itemtime);
                fireRate = 800;
                rapid = 0;
                itemexist = 0;
            }
            
            
        }


   
   //check if number 1~8 is preesed and select turret
    if(game.input.keyboard.isDown(49))
    {
        sturret = 1;
    }
    if(game.input.keyboard.isDown(50))
    {
        sturret = 2;
    }
    if(game.input.keyboard.isDown(51))
    {
        sturret = 3;
    }
    if(game.input.keyboard.isDown(52))
    {
        sturret = 4;
    }
    if(game.input.keyboard.isDown(53))
    {
        sturret = 5;
    }
    if(game.input.keyboard.isDown(54))
    {
        sturret = 6;
    }
    if(game.input.keyboard.isDown(55))
    {
        sturret = 7;
    }
    if(game.input.keyboard.isDown(56))
    {
        sturret = 8;
    }

    //if game is started
    if(started)
    {
        //check if bullet collides to plane. if it did function bulletHitPlayer
        game.physics.arcade.overlap(bullets, roomList[currentroom][currentroom].plane, bulletHitPlane, null, this);
        game.physics.arcade.overlap(star, roomList[currentroom][currentroom].plane, itemActivate, null, this);
        game.physics.arcade.overlap(star, bullets, itemAttackActivate, null, this);
    }
    
    //if user is guest
    if(myId != currentroom)
    {
        //fire when mouseclick
        if(game.input.activePointer.isDown)
        {
            fire(sturret);
        }
    }
    else //if user is host
    {
        //change input when cursor moved
        roomList[currentroom][myId].input.left = cursors.left.isDown;
        roomList[currentroom][myId].input.right = cursors.right.isDown;
        roomList[currentroom][myId].input.up = cursors.up.isDown;
        roomList[currentroom][myId].input.down = cursors.down.isDown;
    }


    //updates every user
    for(var r in roomList)
    {
        for(var i in roomList[r])
        {
            if(!roomList[r][i]) continue;

            roomList[r][i].update();
        }
    }



	
}

//when bullet hit player
function itemActivate(star, plane)
{

    console.log('item act');
    //delete bullet
    star.kill();
   
    invinc = 1;

    invictime = 5;

    roomList[currentroom][currentroom].plane.loadTexture('shield');

    attackside = 0;

    itemStart = parseInt(parseFloat(Math.round(game.time.totalElapsedSeconds() * 100) / 100 +invictime ).toFixed(0));

    nextItem = itemStart + itemdelay;

}

function itemAttackActivate(star, bullets)
{

    console.log('item act');
    //delete bullet
    star.kill();
   
    fireRate = 500;

    rapid = 1;

    

    itemStart = parseInt(parseFloat(Math.round(game.time.totalElapsedSeconds() * 100) / 100 +invictime ).toFixed(0));

    nextItem = itemStart + itemdelay;

}

//when bullet hit player
function bulletHitPlane(plane, bullet)
{
    if(invinc == 0)
    {
        //delete bullet
        bullet.kill();
        //delete plane
        roomList[currentroom][currentroom].kill();
        //write gameover
        game.add.text(300,280,'GAME OVER', { font: '34px Arial', fill: '#fff' });
        //write score
        score = parseFloat(Math.round(game.time.totalElapsedSeconds() * 100) / 100).toFixed(1);
        //score is a game score
        game.add.text(320,330,'Score: '+score, { font: '34px Arial', fill: '#fff' });
        //game is over
        started=false;
        if(myId == currentroom)
        {
             if(confirm('Send your score '+ score +' to server?'))
             {
                $.post("/attackdefend/sendscore.php", {uname: username, cscore: score}, function(){
    });
             }
        }
       
    }
  
}

//render with game loop
function render () 
{
    //when the game actually started
    if(started)
    {
        //write time at left corner
        var time = parseFloat(Math.round(game.time.totalElapsedSeconds() * 100) / 100).toFixed(1);
        game.debug.text('Time: '+time , 32, 32);
    }
    
}

