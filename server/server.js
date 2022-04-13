const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
})
const dotenv = require('dotenv');
dotenv.config();
app.get('/', (req, res) => {
    res.send(":)")
})

io.on('connection', socket => {
    console.log("user connected", socket.id);
    
    socket.on('join', guildId => {
        socket.join(guildId)
        console.log(`user ${socket.id} join room ${guildId}`);
        io.emit("getStatus", guildId)
    })

    // server to client
    socket.on("startTrack", data => {
        io.to(data.guild).emit("startNewTrack", data)
    })

    socket.on("serverSendTime", data => {
        io.to(data.guild).emit("receiveTime", data.time)
    })

    socket.on("serverSendStatus", data => {
        io.to(data.guild).emit("receiveStatus", data)
    })

    socket.on("serverSendPlayRepeatStatus", data => {
        io.to(data.guild).emit("receivePlayRepeatStatus", data.status)
    })

    socket.on("serverSendQueue", data => {
        io.to(data.guild).emit("receiveQueue", data.queue)
    })

    
    // client to server 
    socket.on('clientGetTime', guildId => {
        io.emit("serverGetTime", guildId)
    })

    socket.on('clientShuffleQueue', guildId => {
        io.emit("serverShuffleQueue", guildId)
    })
    
    socket.on('clientNextQueue', guildId => {
        io.emit("serverNextQueue", guildId)
    })

    socket.on('clientPreviousQueue', guildId => {
        io.emit("serverPreviousQueue", guildId)
    })

    socket.on('clientPlayPause', guildId => {
        io.emit("serverPlayPause", guildId)
    })

    socket.on('clientRepeat', guildId => {
        io.emit("serverRepeat", guildId)
    })
})

server.listen(process.env.SOCKET_PORT)