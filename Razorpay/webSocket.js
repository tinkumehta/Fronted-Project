const WebSocket = require('ws');


const server = new WebSocket.Server({port : 7000});

server.on("connection" , (socket) => {
    console.log("Client connected");;

    socket.send("Chai aur code Web socket");

    socket.on("message", (message) => {
        console.log(message);
        socket.send("Hello from server");
    })
})

console.log("WebSocket server running at ws://localhost:7000");
