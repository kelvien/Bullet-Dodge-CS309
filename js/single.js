window.addEventListener("load", drawScreen , false);
var keyState = {};    
window.addEventListener('keydown',function(e){
    keyState[e.keyCode || e.which] = true;
},true);    
window.addEventListener('keyup',function(e){
    keyState[e.keyCode || e.which] = false;
},true);

window.addEventListener('click', onClick);
//window.onclick = onClick();

//Images
var imgBackground = new Image(); //background
imgBackground.src = "background.jpg";
imgBackground.addEventListener("load", drawScreen, false);

var imgPlayer = new Image(); //moveable player
imgPlayer.src = "player.jpg";
imgPlayer.addEventListener("load", drawScreen, false);
var intPlayerX = 400; //starting location of player
var intPlayerY = 300;

var imgBullet = new Image();
imgBullet.src = "bullet.jpg";

var imgPowerUp = new Image(); 
imgPowerUp.src = "powerup.jpg"; //needs change to new picture
var intPowerUpX = 300 + RandomNextInt(300); //random locations for power up
var intPowerUpY = 200 + RandomNextInt(200); 


//Game states 
var GAME_STATE_READY = 0;
var GAME_STATE_GAME = 1;
var GAME_STATE_OVER = 2;
var GAME_STATE_PAUSE = 3;

var GameState = GAME_STATE_READY; //Original game state when you enter game 

var intervalID;

//Game Objects
var intTime = 0; //time recorded for score stats 
var arrMissiles = new Array();
var MissileLimit = 10; //Max amount of missiles on map at one
var PlayerSpeed = 2; //speed you can move the player
var MissileSpeed = .5; //speed of missiles
var PowerUpTime = 5; //timer for when each power up shows up
var PowerUpLive = 0; //state 1 is when power up appears
var Invincible = 0; //state 1 is when the player cannot die
var InvincibleTimer; //Timer set to time when the powerup ends

//Screens for game states
function drawScreenReady(Context) //Ready Game State
{
	//Context.textAlign="center"; 
	Context.fillText("Welcome to Bullet Dodge", 130, 220);
	Context.fillText("-Click to start-", 250, 330);


}
function drawScreenGame(Context) //Game currently playing
{
	for(var i=0; i<arrMissiles.length; i++)
	{
		Context.drawImage(imgBullet, arrMissiles[i].x, arrMissiles[i].y);
	}

}
function drawScreenEnd(Context) //End Game
{
	Context.drawImage(imgBackground, 0, 0);
	Context.fillText("Game Over", 270, 180);
	Context.fillText("Your Time : " + intTime/1000, 220, 280);
}
function drawScreenPause(Context) //Pause
{
	Context.drawImage(imgBackground, 0, 0);
	Context.fillText("Pause", 350, 180);
	Context.fillText("-Click to resume-", 250, 350);
	Context.fillText("Your Time : " + intTime/1000, 220, 280);
}


//Screen shown for each frame
function drawScreen()
{
	//Creates game screen with imgs
	var theCanvas = document.getElementById("GameCanvas");
	var Context = theCanvas.getContext("2d");
	Context.fillStyle = "#000000";
	Context.fillRect(0, 0, 800, 600);
	Context.fillStyle = "#ffffff";
	Context.font = "50px Arial";
	Context.textBaseline = "top";

	//Check what state the game is currently in 
	if(GameState == GAME_STATE_READY)
	{
		drawScreenReady(Context);
	}
	
	else if(GameState == GAME_STATE_GAME)
	{
		Context.drawImage(imgBackground, 0, 0);
		Context.drawImage(imgPlayer, intPlayerX, intPlayerY);
		Context.font = "20px Arial";
		Context.fillText("Time : " + intTime/1000, 20, 5);
		drawScreenGame(Context);
		if(PowerUpLive == 1){
			Context.drawImage(imgPowerUp, intPowerUpX, intPowerUpY);
		}
		
	}
	
	else if(GameState == GAME_STATE_OVER)
	{
		drawScreenEnd(Context);
	}
	else if(GameState == GAME_STATE_PAUSE)
	{
		drawScreenPause(Context);
	}
	
}

//Options for certain game functions
function onGameStart()
{
	onReset();
	GameState = GAME_STATE_GAME;
	intervalID = setInterval(InGameUpdate, 10);

	//creates random missiles
	for(var i=0; i<MissileLimit; i++){
		var MissileType = RandomNextInt(4);
		var intX, intY, intGoX, intGoY;
		switch(MissileType)
		{
			case 1:
				intX = 0;
				intY = RandomNextInt(600);
				intGoX = RandomNextInt(2);
				intGoY = -RandomNextInt(2);
				break;
			
			case 2:
				intX = 800;
				intY = RandomNextInt(600);
				intGoX = -RandomNextInt(2);
				intGoY = -RandomNextInt(2);
				break;
				
			case 3:
				intX = RandomNextInt(800);
				intY = 0;
				intGoX = -RandomNextInt(2);
				intGoY = RandomNextInt(2);
				break;
				
			case 4:
				intX = RandomNextInt(800);
				intY = 600;
				intGoX = -RandomNextInt(2);
				intGoY = -RandomNextInt(2);
				break;
		}
		
		arrMissiles.push({x: intX, y: intY, go_x: intGoX, go_y: intGoY})
	}


}

function onGameOver()
{
	GameState = GAME_STATE_OVER;
	clearInterval(intervalID);
	drawScreen();
}

function onGamePause()
{
	GameState = GAME_STATE_PAUSE;
	drawScreen();
}

function onReady() //Reset state
{

	onReset();
	clearInterval(intervalID);
	GameState = GAME_STATE_READY;
	
	drawScreen();
}

function onReset()
{
	//resets all elements
	arrMissiles = new Array();
	MissileLimit = 10; 
    PlayerSpeed = 2; 
    MissileSpeed = .5;
	intTime = 0;
	intPlayerX = 400;
	intPlayerY = 300;
 	PowerUpTime = 5; 
	PowerUpLive = 0; 
	Invincible = 0; 
}

function RandomNextInt(max){
	return 1 + Math.floor(Math.random() * max);
}

//Moving functions for game 
function MovePlayer()
{
	//Key States for moving player
	if(keyState[37]) //down
	{
		intPlayerX-=PlayerSpeed;
		if(intPlayerX < 0)
		{
			intPlayerX = 0;
		}
	}
	
	if(keyState[39]) //up
	{
		intPlayerX+=PlayerSpeed;
		if(intPlayerX > 780)		
		{
			intPlayerX = 780;
		}
	}
	if(keyState[38]) //left
	{
		intPlayerY-=PlayerSpeed;
		if(intPlayerY < 0)
		{
			intPlayerY = 0;
		}
	}
	if(keyState[40]) //right 
	{
		intPlayerY+=PlayerSpeed;
		if(intPlayerY > 580)
		{
			intPlayerY = 580;
		}
	}
	
}

function IsCollisionWithPlayer(x,y) //checks for collision state
{
	if(intPlayerX - 15 < x && intPlayerX + 15 > x && intPlayerY - 15 < y && intPlayerY + 15 > y ){
			return true;
	}
		return false;
}

function MoveMissile()
{
	for(var i=0; i < arrMissiles.length; i++)
	{
	arrMissiles[i].x += arrMissiles[i].go_x + MissileSpeed;
	arrMissiles[i].y += arrMissiles[i].go_y + MissileSpeed;
		if(IsCollisionWithPlayer(arrMissiles[i].x, arrMissiles[i].y) && Invincible == 0) //if one of the missies hit the player and they arent invincible
		{
			onGameOver();
		}
	
	if(arrMissiles[i].x < 0 || arrMissiles[i].x > 800 || arrMissiles[i].y < 0 || arrMissiles[i].y > 600){ //if missile goes out of bounds
		var MissileType = RandomNextInt(8);
		switch(MissileType)
		{
			case 1: //number 1
				arrMissiles[i].x = 0;
				arrMissiles[i].y = 600;
				arrMissiles[i].go_x = RandomNextInt(2);
				arrMissiles[i].go_y = -RandomNextInt(2);
				break;
			
			case 2: //number 2
				arrMissiles[i].x = 400;
				arrMissiles[i].y = 600;
				arrMissiles[i].go_x = -2 + RandomNextInt(4);
				arrMissiles[i].go_y = -RandomNextInt(2);
				break;
				
			case 3: //number 3
				arrMissiles[i].x = 800;
				arrMissiles[i].y = 600;
				arrMissiles[i].go_x = -RandomNextInt(2);
				arrMissiles[i].go_y = -RandomNextInt(2);
				break;
				
			case 4: //number 4
				arrMissiles[i].x = 0;
				arrMissiles[i].y = 300;
				arrMissiles[i].go_x = RandomNextInt(2);
				arrMissiles[i].go_y = -RandomNextInt(2);
				break;

			case 5: //number 6
				arrMissiles[i].x = 800;
				arrMissiles[i].y = 300;
				arrMissiles[i].go_x = -2 + RandomNextInt(4);
				arrMissiles[i].go_y = -RandomNextInt(2);
				break;

			case 6: //number 7
				arrMissiles[i].x = 0;
				arrMissiles[i].y = 0;
				arrMissiles[i].go_x = RandomNextInt(2);
				arrMissiles[i].go_y = RandomNextInt(2);
				break;

			case 7: //number 8
				arrMissiles[i].x = 400;
				arrMissiles[i].y = 0;
				arrMissiles[i].go_x = -2 + RandomNextInt(4);
				arrMissiles[i].go_y = RandomNextInt(2);
				break;

			case 8: //number 9
				arrMissiles[i].x = 800;
				arrMissiles[i].y = 0;
				arrMissiles[i].go_x = -2 + RandomNextInt(4);
				arrMissiles[i].go_y = RandomNextInt(2);
				break;
		}
	}

	}
	
	drawScreen();
}

function PowerUpCheck() //checking the power up state 
{
	if((intTime/1000 >= PowerUpTime) && (PowerUpLive == 0)){ //checks time if power up should trigger
		PowerUpLive = 1;
		PowerUpTime =  PowerUpTime + 5; //the time when powerup ends
	}
	else if(PowerUpLive == 1){ //State when power up shows
		if((intTime/1000) >= PowerUpTime){ //if time goes by before collision with powerup reset
			PowerUpLive = 0;
			PowerUpTime += 20 + RandomNextInt(20);
			intPowerUpX = 300 + RandomNextInt(300); 
	 		intPowerUpY = 200 + RandomNextInt(200); 
		}
		else if(IsCollisionWithPlayer(intPowerUpX,intPowerUpY)){ //collision state 
			Invincible = 1;
			InvincibleTimer = (intTime / 1000) + 5;
			PowerUpLive = 0;
			PowerUpTime += 20 + RandomNextInt(20); //picks next power up time 
			intPowerUpX = 300 + RandomNextInt(300); 
	 		intPowerUpY = 200 + RandomNextInt(200); 
		}
	}

	InvincibleState(); //runs if Invincible state is live
}

function InvincibleState() //when power up is live
{
	if(Invincible == 1){
		if((intTime/1000) >= InvincibleTimer){
			Invincible = 0;
		}
	}
	
}

//Each frame check for update on where the player and moving objects are
function InGameUpdate()
{
	
	if(GameState != GAME_STATE_PAUSE && GameState != GAME_STATE_OVER){
		intTime += 10;
		MovePlayer();
		MoveMissile();
		PowerUpCheck();
		drawScreen();	
	}
}

function onClick()
{
	if(GameState == GAME_STATE_READY){ //starts the game when in ready state and clicks
		onGameStart();
	}
	else if(GameState == GAME_STATE_GAME){ //pauses game when click
		onGamePause();
	}
	else if(GameState == GAME_STATE_PAUSE){ //gets out of pause and goes back to game
		GameState = GAME_STATE_GAME;
		drawScreen();
	}
	else if(GameState == GAME_STATE_OVER){ //click when game is over to reset and go back to ready
		onReady();
	}

}