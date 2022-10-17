const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const morgan = require('morgan');

const { ExpressPeerServer } = require('peer');

const app = express();

const server = http.createServer(app);
const io = socketio(server).sockets;

//Borderparser
app.use(express.json());

const customeGerenerationFunction = () =>
  (Math.random().toString(36) + "000000000000000000000").substring(2, 16);

const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: "/",
  generateClientId: customeGerenerationFunction,
});

app.use("/mypeer", peerServer);

io.on('connection', function (socket) {
  socket.on('join-room', ({ roomID, userId }) => {
    socket.join(roomID);
    socket.to(roomID).broadcast, emit("user-connected", userId);
  })
});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server is running on port ${port}!`));