

var express = require('express')
  , app = express(app)
  , server = require('http').createServer(app);

// serve static files from the current directory
app.use(express.static(__dirname));

//we'll keep clients data here
var clients = {};

//we'll keep rooms data here
var rooms = {};
//how many rooms
var roomcount = 0;
//get EurecaServer class
var EurecaServer = require('eureca.io').EurecaServer;

//create an instance of EurecaServer
var eurecaServer = new EurecaServer({allow:['setId', 'spawnEnemy', 'kill', 'updateState', 'updateBullet', 'wait', 'updateItem']});

//who is current user
var currentuser

//attach eureca.io to our http server
eurecaServer.attach(server);



//eureca.io provides events to detect clients connect/disconnect

//detect client connection
eurecaServer.onConnect(function (conn) {    
    console.log('New Client id=%s ', conn.id, conn.remoteAddress);
	
	//the getClient method provide a proxy allowing us to call remote client functions
    var remote = eurecaServer.getClient(conn.id);    
	
	//register the client
	clients[conn.id] = {id:conn.id, remote:remote, room:null, uname: null}
	
    console.log('user: ',clients[conn.id].uname);
    //current user 
    currentuser = conn.id;	
});

//detect client disconnection
eurecaServer.onDisconnect(function (conn) {    
    console.log('Client disconnected ', conn.id);
    
    var removeId = clients[conn.id].id;
    
    delete clients[conn.id];
    //let every clients in server knows who is dced
    for (var c in clients)
    {
        var remote = clients[c].remote;
        
        //here we call kill() method defined in the client side
        remote.kill(conn.id);
    }   
});


//synchroize plane's position
eurecaServer.exports.handshake = function()
{



    var conn = this.connection;
    //for every room in server
    for(var r in rooms)
    {
        //if user is host (really does not need this)
        if(clients[r]!=undefined)
        {
            if(conn.id == clients[r].id)
            {
                
                var remote = clients[rooms[r].player_host].remote;
                var x = clients[rooms[r].player_client].laststate ? clients[rooms[r].player_client].laststate.x:  0;
                var y = clients[rooms[r].player_client].laststate ? clients[rooms[r].player_client].laststate.y:  0;
                remote.spawnEnemy(rooms[r].player_client, x, y, r);
                console.log('host');
                

            }
            else if(conn.id == rooms[r].player_client) //if user is client get plane position
            {   

                 var remote2 = clients[rooms[r].player_client].remote;
                var x2 = clients[rooms[r].player_host].laststate ? clients[rooms[r].player_host].laststate.x:  0;
                var y2 = clients[rooms[r].player_host].laststate ? clients[rooms[r].player_host].laststate.y:  0;
                remote2.spawnEnemy(rooms[r].player_host, x2, y2, r);
                console.log('client');

            }
            else //if user is not related to the room just jump to other user
            {

            }
        }
            
        


               
    }




}


//be exposed to client side (plane)
eurecaServer.exports.handleKeys = function (keys) {
	var conn = this.connection;
	var updatedClient = clients[conn.id];

    //for every clients
	for (var c in clients)
	{
		var remote = clients[c].remote;
		//update planes (function located in index.html)
        remote.updateState(updatedClient.id, keys);
		
		//keep last known state so we can send it to new connected clients
		clients[c].laststate = keys;
	} 
}

//be exposed to client side (bullet)
eurecaServer.exports.handleBullet = function (x, y, px, py, room) {
    var conn = this.connection;
    var updatedClient = clients[conn.id];
    var remote = clients[room].remote;
    //update bullet (function located in index.html)
    remote.updateBullet(x, y, px, py, room);

}


eurecaServer.exports.handleItem = function (x, y, item, room) {
    var conn = this.connection;
    var updatedClient = clients[conn.id];
    var remote = clients[room].remote;
    //update bullet (function located in index.html)
    remote.updateItem(x, y, item , room);

}


//when user clicked join, find game
 eurecaServer.exports.findGame = function() {
    console.log('executed');  
       var conn = this.connection;
        //if there is a room
        if(roomcount>0) {
                
            var joined_a_game = false;
            //check every room
            for(var roomid in rooms) {

                    //get the game we are checking against
                var game_instance = rooms[roomid];

                    //If the game is a player short
                if(game_instance.player_count < 2) {

                        //someone wants us to join!
                    joined_a_game = true;
                        //increase the player count and store
                        //the player as the client of this game
                    game_instance.player_client = currentuser;
                    game_instance.player_count++;
                    clients[conn.id].room = game_instance.player_host;
                        //start running the game on the server,
                        //which will tell them to respawn/start
                    startGame(game_instance);

                } //if less than 2 players
            } //for all games

                //now if we didn't join a game,
                //we must create one
            if(!joined_a_game) {

                createGame(currentuser);

            } //if no join already

        } else { //if there are any games at all

                //no games? create one!
            createGame(currentuser);
        }
    }

//user becomes host and create game
function createGame(player)
{
    var remote = clients[player].remote;
    console.log('player ' + player + ' created a game');
            //Create a new game instance
        var thegame = {
                id : player,                //generate a new id for the game
                player_host:player,         //so we know who initiated the game
                player_client:null,         //nobody else joined yet, since its new
                player_count:1              //for simple checking of state
            };

            //Store it in the list of game
        rooms[ player ] = thegame;

            //Keep track
        roomcount++;

        console.log('player ' + player + ' created a game with id ' + thegame.id);
        clients[player].room = player;
            //return it
        remote.wait();
        return thegame;
}

function startGame(game) {

    //initialize setID(located in index.html) clients
    var remote2 = clients[game.player_client].remote;
    remote2.setId(game.player_client, game.player_host);

    //initialize setID(located in index.html) host
    var remote = clients[game.player_host].remote;
    remote.setId(game.player_host, game.player_host);
        

    }
//listen to port 8443
server.listen(8443,function(){
    
    console.log('listening on *:8443');
    });