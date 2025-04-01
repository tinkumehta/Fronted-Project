// server.js

const express = require('express')
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);



connectDB();
app.use(express.json());
app.use('/api/auth', authRoutes);
io.on('connection', (socket) =>{
    console.log('New client connected');
    socket.on('sync', (data) => {
        io.emit('sync', data);
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});


const PORT = process.env.PORT ||8000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));