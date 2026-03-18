const socket = io();
let username = "";

function saveUser(){
username = document.getElementById("username").value;
}

let localStream;
let peer;

async function startChat(){
    const gender = document.getElementById("gender").value;
socket.emit("ready", gender);

localStream = await navigator.mediaDevices.getUserMedia({
video:true,
audio:true
});

document.getElementById("localVideo").srcObject = localStream;

socket.emit("ready");

}

socket.on("matched", async () => {

peer = new RTCPeerConnection();

localStream.getTracks().forEach(track => {
peer.addTrack(track, localStream);
});

peer.ontrack = (event)=>{
document.getElementById("remoteVideo");
if (remoteVideo){
    remoteVideo.srcObject = 
    event.streams[0];
}
}

peer.onicecandidate = (event)=>{
if(event.candidate){
socket.emit("signal", event.candidate);
}
};

let offer = await peer.createOffer();
await peer.setLocalDescription(offer);

socket.emit("signal", offer);

});

socket.on("signal", async (data)=>{

if(data.type === "offer"){

peer = new RTCPeerConnection();

localStream.getTracks().forEach(track => {
peer.addTrack(track, localStream);
});

peer.ontrack = (event)=>{
document.getElementById("remoteVideo").srcObject = event.streams[0];
};

peer.onicecandidate = (event)=>{
if(event.candidate){
socket.emit("signal", event.candidate);
}
};

await peer.setRemoteDescription(data);

let answer = await peer.createAnswer();
await peer.setLocalDescription(answer);

socket.emit("signal", answer);

}

else if(data.type === "answer"){

await peer.setRemoteDescription(data);

}

else{

await peer.addIceCandidate(data);

}

});

function nextUser(){
    socket.emit("next");
    document.getElementById("remoteVideo").srcObject = null;
    if (peer){
        peer.close();
    }
}
function sendMessage(){

const input = document.getElementById("messageInput");

const message = input.value;

socket.emit("chat-message", message);

addMessage(username+":" + message);

input.value = "";

}

socket.on("chat-message", (msg)=>{

addMessage(username+":" + msg);

});

function addMessage(text){

const box = document.getElementById("chatBox");

const p = document.createElement("p");

p.innerText = text;

box.appendChild(p);

}
let coins = 10;

function nextUser(){

if(coins <= 0){
alert("No coins left");
return;
}

coins--;

socket.emit("next");

}