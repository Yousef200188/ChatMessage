const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io')
const cors = require('cors')

const app = express();
const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin:"*" // Allow all origins (use only for development)
    }
})
app.use(cors())

io.on('connection', (socket) => {
    console.log(' user connected with id :',socket.id);
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('send messages to all users', msg)
    });
    socket.on('typing', () => {
        socket.broadcast.emit('show typing status')
    })
    socket.on('stop_typing',()=>{
        socket.broadcast.emit('clear typing status')
    })
    socket.on('disconnect',()=>{
        console.log('left the chat with the socket id :'+socket.id)
    })
});



server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});