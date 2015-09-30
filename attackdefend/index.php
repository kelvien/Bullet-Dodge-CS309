<?php
	
	if(isset($_GET['token']))
	{
		$token = $_GET['token'];
	}
	else
	{
		$token = "null";
	}

?>
<!--Side menu-->
 <div class="snap-drawers">
    <!-- <div class="snap-drawer snap-drawer-left">
    <div class="snap-drawer-menu">
    </div>
    <div class="snap-drawer-add_friend">
    <p class="text-center">Find a friend</p>
    <input type="text" class="findFriend" placeholder="Enter friend's ID"/>
    <div class="findFriend_list">
    </div>
    </div>
    <div class="snap-drawer-friend_list">
    <?php //include("include/chat_part-revised.php"); ?> 
    </div>
    </div> -->
</div>
<div id="menu_content" class="snap-content">
<div class="snap-drawer snap-drawer-left" style="right:0!important;">
    <div class="snap-drawer-menu">
    <!-- <p class="text-center">MENU</p> -->
    </div>
    <div class="snap-drawer-add_friend">
    <p class="text-center">Find a friend</p>
    <input type="text" class="findFriend" placeholder="Enter friend's ID"/>
    <div class="findFriend_list">
    </div>
    </div>
    <div class="snap-drawer-friend_list">
    <!--Chat-->
    <?php include("include/chat_part-revised.php"); ?> 
    </div>
</div>
<div class="container">
<div class="row">
<div class="col-xs-12">

    	<div class="hidden">
    		<button id="but1" type="button" onclick="join()">join</button>
    	</div>
    	<div id="game-box" style="padding: 20px;">

    	</div>
</div>
</div>
</div>
<div id="chat_with_friends_container"></div>
</div>


	<script type="text/javascript" src="/library/eureca.js"></script>
	<script type="text/javascript" src="/attackdefend/js/phaser.js"></script>
	<script type="text/javascript" src="/attackdefend/js/game/attackdefend.js"></script>
	<script type="text/javascript">
		var eurecaServer;
		//create game board
		var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-box', { preload: preload, create: null, update: update, render: render });
		
		//indicates current room id
		var currentroom;

		//waiting text
		var wait;
		var token = <?php echo json_encode($token); ?>;
		var username = <?php echo json_encode($_SESSION['uname']); ?>;


		//when click join
		function join()
		{
			var eurecaClient = new Eureca.Client();
			
			//send server that user clicked join
			eurecaClient.ready(function (proxy) {		
				
				eurecaServer = proxy;
				if(token != null)
				{
					proxy.findPrivateGame(token);
				}
				else
				{
					proxy.findGame();
				}
				$("#game-box canvas").css("margin", "0 auto");
			});
			
			
			//actually creates game for user
			eurecaClient.exports.setId = function(id, room) 
			{
				if(wait!=undefined)
				{
					wait.visible = false;
				}
				else
				{
					var elem = document.getElementById('but1');
    				elem.parentNode.removeChild(elem);
				}
				
				myId = id;
				currentroom = room;
				create();
				eurecaServer.handshake();
				ready = true;

			}	
			
			//delete user
			eurecaClient.exports.kill = function(id)
			{	
				if(roomList[currentroom][id])
				{
					roomList[currentroom][id].kill();
				}
			}	
			
			//spawn tank
			eurecaClient.exports.spawnEnemy = function(i, x, y, cr)
			{
				//if it is myself just return
				if(myId == i)
				{
					return;
				}

				console.log('SPAWN');

				//if it is correct room spawn tank
				if(cr == currentroom)
				{
					if(myId != cr)
					{
						var pln = new Plane(i,game,plane);
						roomList[currentroom][i] = pln;
					}
					
				}
				
				//start game
				game.paused=false;
				//start timer
				game.time.reset();
				//game started
				started = true;


			}
			
			//update when plane moved
			eurecaClient.exports.updateState = function(id, state)
			{
				console.log('++++++++++'+id);
				if(roomList[currentroom][id])
				{
					roomList[currentroom][id].cursor = state;
					roomList[currentroom][id].plane.x = state.x;
					roomList[currentroom][id].plane.y = state.y;
					//update functon in game js
					roomList[currentroom][id].update();

				}
	
			}

			//update when bullet shoots
			eurecaClient.exports.updateBullet = function(x, y, px, py, room)
			{
				console.log("shoot");
				var bullet = bullets.getFirstExists(false);
				
		        bullet.reset(x, y);

		        bullet.rotation = game.physics.arcade.moveToXY(bullet, px, py, 800, 500);
	
			}

			eurecaClient.exports.wait = function()
			{
				var elem = document.getElementById('but1');
    			elem.parentNode.removeChild(elem);

    			wait = game.add.text(150,310,'Waiting for opponent to connect', { font: '34px Arial', fill: '#fff' });
	
			}

			eurecaClient.exports.updateItem = function(x, y, item ,room)
			{	
				console.log("itemitem");
				if(item == "star")
				{
					star = game.add.sprite( x, y ,'star');
					game.physics.enable(star, Phaser.Physics.ARCADE);
		        	itemexist = 1;
				}
		           
	
			}


		}


		$( document ).ready(function() {
			
    		if(token != null)
    		{
    			join();
    		}
		});

	</script>
