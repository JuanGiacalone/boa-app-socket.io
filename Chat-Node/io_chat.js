var express = require('express'),
    http = require('http');
var path = require('path');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(5501, () => {
  console.log('listening on *:5501');
        });


  app.use(express.static(path.join(__dirname, 'chat-node')));

    
        //contador de usuarios
    var numUsers = 0;

    io.on('connection', (socket) => {
    var addedUser = false;
    console.log(socket.id);

    socket.on('add user', (username) => {
      if (addedUser) return;
  
      // guardamos el nombre de usuario en la variable de sesion del socket
      socket.username = username;
      console.log(socket.username);
      ++numUsers;
      addedUser = true;
      socket.emit('login', {
        numUsers: numUsers
      });
    });
    socket.on('new message', (msg) => {
      socket.broadcast.emit('new message', {
        username: socket.username,
        message: msg

      });
    });
  });


