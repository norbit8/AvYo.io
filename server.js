var cliento = [];
var hello = [];
var express = require('express'),
    app = express();
var server= app.listen((process.env.PORT || 3000));
var socket = require ('socket.io');
var io = socket(server);

app.use(express.static('public'));
io.on('connection', newConnection);
console.log("My soket server is running");


function newConnection(socket) {
  console.log('new connection: ' + socket.id);
  socket.on('mouse', mouseMsg);
  socket.on('idle', sendClients);

  function mouseMsg(data){
    socket.to(data.to).emit('mouse', data);
  //  console.log(data);
  }

  socket.on('idle', sendClients);

  function sendClients(){

    io.clients((error, cliento) => {
    if (error) throw error;
    // Returns an array of client IDs like ["Anw2LatarvGVVXEIAAAD"]
    else{
  //  console.log(cliento);
    hello.splice(0,hello.length);
    for (c of cliento){
    hello.push(c);
    }
    }
    });
    io.sockets.emit('getClients', hello);

    //var total=io.engine.clientsCount; <--- clients number
  }

  socket.on('invite', (socketId) => {  // send invitation
    console.log(socketId);
    socket.to(socketId.whoIWant).emit('gotInvite', socketId.whoAmI);
  });

  socket.on('accepted', (dataAccepted) => {
    socket.to(dataAccepted.whoIWant).emit('isAccepeted', dataAccepted);
  });


}
