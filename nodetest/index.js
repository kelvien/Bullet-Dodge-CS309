var app = require('express');
var http = require('http');
var socket = require('socket.io');
var server = http.createServer(app);
var io = socket.listen(server);

/*Variables*/
var connectedUsers = {};

<<<<<<< HEAD
<<<<<<< HEAD
io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
    io.emit('chat message', socket.uname + " have left the chat.");
    delete connectedUsers[socket.uname];
    io.emit('list online users', connectedUsers);
  });

  socket.on('chat message', function(msg){
    var ret = socket.uname + ": " + msg;
    io.emit('chat message', ret);
  });
  
  socket.on('register', function(msg){
    socket.uname = msg;
    io.emit('chat message', socket.uname + " have just joined the chat.");
    connectedUsers[socket.uname] = 1;
    console.log(msg+" registered");
    io.emit('list online users', connectedUsers);
  });
=======
=======
>>>>>>> Kelvien
io.sockets.on('connection', function(socket){
  console.log('a user connected');

  socket.on('register', function(data, callback){
      socket.uname = data;
      //io.emit('chat message', socket.uname + " have just joined the chat.");
      connectedUsers[socket.uname] = socket;
      console.log(data+" registered");
      io.emit('list online users', Object.keys(connectedUsers));
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
    //io.emit('chat message', socket.uname + " have left the chat.");
    delete connectedUsers[socket.uname];
    io.emit('list online users', Object.keys(connectedUsers));
  });

  socket.on('chat message', function(data){
    console.log("Sent to: "+data.to+", msg: "+data.msg);
    var sendTo = data.to;
    data.to = socket.uname;
    connectedUsers[sendTo].emit('chat message', data);
  });
  
<<<<<<< HEAD
>>>>>>> Kelvien
=======
>>>>>>> Kelvien
});

server.listen(8080, function(){
  console.log('listening on *:8080');
});