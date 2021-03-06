const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

let app = express();
app.use(express.static(publicPath));
let server = http.createServer(app);
let io = socketIO(server);
io.on('connection', socket => {
  console.log("New user connected!");
  socket.on('pDataIn', data => {
    socket.broadcast.emit('pDataOut', data);
  })
  socket.on('pOut', id => {
    socket.broadcast.emit('delete', id);
  });
});


server.listen(port, () => {
  console.log(`Server up on port ${port}`);
})
