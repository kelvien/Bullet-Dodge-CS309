var myId=0; //current user's id
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'GameCanvas', { preload: preload, create: create, update: update });

window.addEventListener('click', onClick);

var land; //background

var plane; //plane
var player; //player information include plane
var planeList; //list of planes for other rooms
var roomList; //list of rooms 

var cursors; //left,right,up,down cursor information

var guest;

var bullets;  //groups of bullet
var nextFire = 0; //bullet can shoot after this time period
var fireRate = 3000; //how fast the bullet shoot
var bulletSpeed = 2500; //how fast the bullet is

var turret1; //turret at left top corner 7
var turret2; //8
var turret3; //9
var turret4; //6
var turret5; //3
var turret6; //2
var turret7; //1
var turret8; // turret at left middle 4
var intTime = 0; //time recorded for score stats

/*
var imgPowerUp = new Image(); //power up image
imgPowerUp.src = "powerup.jpg"; 
var intPowerUpX = 300 + RandomNextInt(300); //random locations for power up
var intPowerUpY = 200 + RandomNextInt(200); 
*/

//Game states 
var GAME_STATE_READY = 0;
var GAME_STATE_GAME = 1;
var GAME_STATE_OVER = 2;
var GAME_STATE_PAUSE = 3;

var GAMESTATE = GAME_STATE_READY; //Original game state when you enter game 

//power up 
var intPowerUpX = 300 + RandomNextInt(300); //random locations for power up
var intPowerUpY = 200 + RandomNextInt(200); 
var PowerUpTime = 5; //timer for when each power up shows up
var PowerUpLive = 0; //state 1 is when power up appears
var Invincible = 0; //state 1 is when the player cannot die
var InvincibleTimer; //Timer set to time when the powerup ends

//load image before create game
function preload () {
    game.load.image('bd', 'attackdefend/js/new/BD.png');
    game.load.image('plane', 'attackdefend/js/new/player2.png');
    game.load.image('bullet', 'attackdefend/js/new/laserBlue02.png');
    game.load.image('earth', 'attackdefend/js/new/background.png');
    game.load.image('star', 'attackdefend/js/new/star_gold.png');
    game.load.image('shield', 'attackdefend/js/new/player.png');
    game.load.image('bullet2', 'attackdefend/js/new/laserRed02.png');
    game.load.image('turret', 'attackdefend/js/new/turret.png');
}

//Screens for game states
function drawScreenReady() //Ready Game State
{
    create();
    title = game.add.sprite(130,210,'bd'); 
    game.add.text(250,330,'-CLICK TO START-', { font: '34px Arial', fill: '#fff' }); 
    $("#GameCanvas canvas").css("margin", "0 auto");
}

function drawScreenPause() //Pause
{
    create();
    game.add.text(300,280,'GAME PAUSED', { font: '34px Arial', fill: '#fff' });
    game.add.text(320,330,'Score: '+intTime/1000, { font: '34px Arial', fill: '#fff' });
}


function drawScreenEnd() //End Game
{
    create();
    Context.fillText("Game Over", 270, 180);
    Context.fillText("Your Time : " + intTime/1000, 220, 280);
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

    var x = 0;
    var y = 0;

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
function movePlane() {

    //plane moves 3px every updates (speed of plane)
    if (cursors.left.isDown)
    {
        player.plane.x = player.plane.x - 4;
    }
    else if (cursors.right.isDown)
    {
        player.plane.x += 4
    }   
    if (cursors.up.isDown)
    {
        player.plane.y -= 4;
    }
    else if(cursors.down.isDown)
    {
        player.plane.y += 4;
    }
    
    
    
};

//create game board
function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
	//  Resize our game world to be a 800 x 600 square
    game.world.setBounds(0, 0, 800, 600);
    game.stage.disableVisibilityChange  = true;
    
    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, 800, 600, 'earth');

    //fix camera at same position
    land.fixedToCamera = true;

    if(GAMESTATE == GAME_STATE_GAME){
        //creates plane
        player = new Plane(myId, game, plane);

        plane = player.plane;
        plane.x = 400;
        plane.y = 300;
        plane.bringToTop();

    //creates turret
    turret1 = game.add.sprite(30,-20,'turret');
    turret2 = game.add.sprite(430,0, 'turret');
    turret3 = game.add.sprite(820,20,'turret');
    turret4 = game.add.sprite(800,310,'turret');
    turret5 = game.add.sprite(770,610,'turret');
    turret6 = game.add.sprite(380,600,'turret');
    turret7 = game.add.sprite(-20,580,'turret');
    turret8 = game.add.sprite(0,270,'turret');


    //set turret's starting angle
    turret1.angle = 45;
    turret2.angle = 90;
    turret3.angle = 135;
    turret4.angle = 180;
    turret5.angle = 225;
    turret6.angle = 270;
    turret7.angle = 315;
    turret8.angle = 0;

    //initializes cursors
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
}


//fire bullet
function fire () {
    //x value of turret
    var tx=0;
    //y value of turret
    var ty=0;


    //when delay of fire is passed
    if (game.time.now > nextFire && bullets.countDead() > 0)
    {

        if(fireRate > 500){ //increases fire rate
            fireRate = fireRate - 100;
        }
        
        if(fireRate <= 500){
            if(bulletSpeed >= 100){
            bulletSpeed = bulletSpeed - 50;
            }
        }

        //calculate next delay of fire
        nextFire = game.time.now + fireRate;

        //creates bullet
        var bullet = bullets.getFirstExists(false);
        var direction;
        //set tx & ty to selected turret
        switch(1 + RandomNextInt(7))
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
        bullet.reset(tx, ty)

        //current mouse pointer
        //var po = game.input.activePointer;

        //move bullet to current player's x & y
        bullet.rotation = game.physics.arcade.moveToXY(bullet, plane.x, plane.y, 10, bulletSpeed); //last is maxtime bullet is on screen 
    }

}

function RandomNextInt(max){
    return 1 + Math.floor(Math.random() * max);
}

//loop updates in game
function update () {

    //start menu waiting for click
    if(GAMESTATE == GAME_STATE_READY) {
        intTime = 0;
        drawScreenReady();
    }
    else if(GAMESTATE == GAME_STATE_GAME) //if game is started
    {
        render();
        movePlane();
        PowerUpCheck();

        if(Invincible == 0){ //only runs if plane is not invincible
        //check if bullet collides to plane. if it did function bulletHitPlayer
        game.physics.arcade.overlap(bullets, plane, bulletHitPlane, null, this);
        }

        fire(); //fires bullets
 
    }
    else if (GAMESTATE == GAME_STATE_PAUSE){
        drawScreenPause();
    }  
	
}

//when bullet hit player
function bulletHitPlane(plane, bullet)
{
    //delete bullet
    bullet.kill();
    //delete plane
    //write gameover
    game.add.text(300,280,'GAME OVER', { font: '34px Arial', fill: '#fff' });
    //score is a game score
    game.add.text(320,330,'Score: '+intTime/1000, { font: '34px Arial', fill: '#fff' });
    //game is over
    GAMESTATE = GAME_STATE_OVER;
    
}

//delete plane
Plane.prototype.kill = function()
{
    this.alive = false;
    this.plane.kill();
}

//render with game loop
function render() 
{
    //when the game actually started
    if(GAMESTATE == GAME_STATE_GAME)
    { 
        intTime += 37;
        
        //game.debug.text('Time: '+intTime/1000 , 32, 32);
        //write time at left corner
        //game.add.text(50, 32,'Score: '+intTime/1000, { font: '18px Arial', fill: '#fff' });
    }
    
}


function onClick()
{
    if(GAMESTATE == GAME_STATE_READY){ //starts the game when in ready state and clicks
        GAMESTATE = GAME_STATE_GAME;
        create();
        title.destroy(); 
    }
    else if(GAMESTATE == GAME_STATE_GAME){ //pauses game when click
        GAMESTATE = GAME_STATE_PAUSE;
        game.paused = true;
    }
    else if(GAMESTATE == GAME_STATE_PAUSE){ //gets out of pause and goes back to game
        GAMESTATE = GAME_STATE_GAME;
        game.paused = false;
    }
    else if(GAMESTATE == GAME_STATE_OVER){ //click when game is over to reset and go back to ready
        GAMESTATE = GAME_STATE_READY;
    }

}


function PowerUpCheck() //checking the power up state 
{
    if((intTime/1000 >= PowerUpTime) && (PowerUpLive == 0)){ //checks time if power up should trigger
        PowerUpLive = 1;
        PowerUpTime =  (intTime/1000) + 5; //the time when powerup ends
        star = game.add.sprite(intPowerUpX, intPowerUpY,'star'); //shows power up 
    }
    else if(PowerUpLive == 1){ //State when power up shows

        if((intTime/1000) >= PowerUpTime){ //if time goes by before collision with powerup reset
            PowerUpLive = 0;
            PowerUpTime += 20 + RandomNextInt(20);
            intPowerUpX = 300 + RandomNextInt(300); 
            intPowerUpY = 200 + RandomNextInt(200);
            star.destroy(); //star dissapears
        }
        else if(IsCollisionWithPlayer(intPowerUpX,intPowerUpY)){ //collision state 
            Invincible = 1;
            InvincibleTimer = (intTime/1000) + 5;
            PowerUpLive = 0;
            PowerUpTime += 20 + RandomNextInt(20); //picks next power up time 
            intPowerUpX = 300 + RandomNextInt(300); 
            intPowerUpY = 200 + RandomNextInt(200); 
            star.destroy(); //star dissapears
        }

    }
    InvincibleState(); //runs if Invincible state is live
}

function InvincibleState() //when power up is live
{
    if(Invincible == 1){
        player.plane.loadTexture('shield'); //makes plane bigger 

        if((intTime/1000) >= InvincibleTimer){
            player.plane.loadTexture('plane'); 
            Invincible = 0;
        }
    }
    
}

function IsCollisionWithPlayer(x,y) //checks for collision state
{
    if(player.plane.x - 25 < x && player.plane.x + 25 > x && player.plane.y - 25 < y && player.plane.y + 25 > y ){
            return true;
    }
        return false;
}

