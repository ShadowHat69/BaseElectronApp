const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 800
  })

  win.loadFile('index.html') //Even Electron must load the index from the server URL
}

app.whenReady().then(() => {
  createWindow()
})


//Node.js server

const express = require('express');
const expressapp = express();
const http = require('http');
const server = http.createServer(expressapp);
const { Server } = require("socket.io");
const io = new Server(server);
var open = require('open');

expressapp.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let users = 0;

io.on('connection', (socket) => {
  console.log(socket.id + ' has connected');
  users++;
  console.log('Connected Users: ' + users);

  socket.on('disconnect', () => { //You have to check to see if that specific socket left
    console.log(socket.id + ' has disconnected');
    users--;
    console.log('Connected Users: ' + users);
  });

  socket.on('buttonpress', (selfid, otherid) => { //Custom Emit detection. Insert new functionality here.
    let lock = selfid;
    let unlock = otherid;

    io.emit('btnresponse', lock, unlock);
    
    //socket.emit('lockall');
    console.log( lock + ' pressed');
  });
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});