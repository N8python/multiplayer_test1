//Canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const id = Math.random()
let localPlayer = {
  x: 250,
  y: 250,
  alive: true,
  id
}
let playerList = []
let gameInterval = setInterval(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(localPlayer.x, localPlayer.y, 50, 50);
  for(let player of playerList){
    ctx.fillRect(player.x, player.y, 50, 50);
  }
  sendData(localPlayer);
}, 30);

let stage = 2;
let disconnectInterval = setInterval(() => {
  if(stage % 2 === 0) {
    for(let player of playerList) {
      player.alive = false;
    }
  }
  if(stage % 2 === 1) {
    for (let player of playerList) {
      if(player.alive === false){
        playerList.splice(playerList.indexOf(player), 1);
      }
    }
  }
  stage++;
}, 1000)

document.addEventListener('keydown', e => {
  if(e.keyCode === 37) localPlayer.x -= 3;
  if(e.keyCode === 39) localPlayer.x += 3;
  if(e.keyCode === 38) localPlayer.y -= 3;
  if(e.keyCode === 40) localPlayer.y += 3;
});
//Server Side Communication
let socket = io();
socket.on('connect', () => {
  console.log("Connected to the Server");
});

socket.on('pDataOut', data => {
  let obj = playerList.find(i => i.id === data.id) || data;
  if(playerList.includes(obj)) playerList[playerList.indexOf(obj)] = data;
  else playerList.push(data);
});

socket.on('delete', id => {
  console.log("Recieved BOI!");
  playerList.splice(playerList.indexOf(playerList.find(i => i.id === id)), 1);
})
function sendData(data){
  socket.emit('pDataIn', data);
}
