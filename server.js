const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let waitingUser = null;

io.on("connection", (socket)=>{

console.log("User connected");

socket.on("ready", ()=>{

if(waitingUser){

socket.partner = waitingUser;
waitingUser.partner = socket;

socket.emit("matched");
waitingUser.emit("matched");

waitingUser = null;

}else{

waitingUser = socket;

}

});

socket.on("signal", (data)=>{

if(socket.partner){
socket.partner.emit("signal", data);
}

});

socket.on("next", ()=>{

if(socket.partner){
socket.partner.partner = null;
socket.partner.emit("partner-left");
}

socket.partner = null;

if(waitingUser){

socket.partner = waitingUser;
waitingUser.partner = socket;

socket.emit("matched");
waitingUser.emit("matched");

waitingUser = null;

}else{

waitingUser = socket;

}

});

socket.on("disconnect", ()=>{
console.log("User disconnected");
});
socket.on("chat-message", (msg)=>{

if(socket.partner){
socket.partner.emit("chat-message", msg);
}

});
});

server.listen(3000, ()=>{
console.log("Server running on port 3000");
});


 

