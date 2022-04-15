const Client = require('./structures/Clients')
const { QueryResolver } = require("discord-player")
const client = new Client()
console.log("Starting Bot . . .")
client.start()

client.webControl.get('/', (req, res) => {
    res.send(":)")
})

client.webControl.get('/:serverId', async (req, res) => {
    try {
        const queue = await client.player.getQueue(req.params.serverId)
        const tracks = queue.tracks
        if (!queue) return res.json({
            message: "Queue empty"
        })
        return res.render('webControl',{
            socketUrl: process.env.WEBCONTROL_SOCKET,
            time: Date.now(),
            server: queue.guild, 
            tracks: tracks,
            currentSong: queue.current
        })
    } catch (error) {
        if (error.code = "UnknownGuild") return res.render("404")
        res.send(error)    
    }
})

client.player.on("trackStart", queue => {
    const track = queue.current
    client.socket.emit("startTrack", {
        guild: queue.guild.id,
        track: track,
        queue: queue.tracks
    })
})

client.socket.on("serverGetTime", async guildId => {
    try {
        const queue = await client.player.getQueue(guildId)
        client.socket.emit("serverSendTime", {
            guild: guildId,
            time: queue.getPlayerTimestamp()
        })
    } catch (error) {

    }
})

client.socket.on("serverShuffleQueue", async guildId => {
    try {
        const queue = await client.player.getQueue(guildId)
        queue.shuffle()
        client.socket.emit("serverSendQueue", {
            guild: guildId,
            queue: queue.tracks
        })
    } catch (error) {
        console.log(error)   
    }
})

client.socket.on("serverNextQueue", async guildId => {
    try {
        const queue = await client.player.getQueue(guildId)
        queue.skip()
    } catch (error) {
        console.log(error)   
    }
})

client.socket.on("serverPreviousQueue", async guildId => {
    try {
        const queue = await client.player.getQueue(guildId)
        queue.back()
    } catch (error) {
        
    }
})

client.socket.on("serverSeek", async data => {
    try {
        const queue = await client.player.getQueue(data.guild)
        queue.seek(data.seek)
    } catch (error) {
        console.log(error)
    }
})

client.socket.on("serverPlayPause", async guildId => {
    try {
        const queue = await client.player.getQueue(guildId)
        if (!client.musicPaused) {
            queue.setPaused(true)
            client.musicPaused = true
        } else {
            queue.setPaused(false)
            client.musicPaused = false
        }
        client.socket.emit("serverSendPlayRepeatStatus", {
            guild: guildId,
            status: {
                paused: client.musicPaused,
                repeat: queue.repeatMode
            }
        })
    } catch (error) {
        console.log(error) 
    }
})

client.socket.on("serverRepeat", async guildId => {
    try {
        const queue = await client.player.getQueue(guildId)
        if (queue.repeatMode == 0) {
            queue.setRepeatMode(2)
        } else {
            queue.setRepeatMode(0)
        }
        client.socket.emit("serverSendPlayRepeatStatus", {
            guild: guildId,
            status: {
                paused: client.musicPaused,
                repeat: queue.repeatMode
            }
        })
    } catch (error) {
        console.log(error)
    }
})

client.socket.on("serverTrackSelected", async data => {
    try {
        const queue = await client.player.getQueue(data.guild)
        await queue.skipTo(data.position - 1)
    } catch (error) {
        console.log(error)
    }
})

client.socket.on("serverInputQuery", async data => {
    try {
        const queue = await client.player.createQueue(data.guild)
        const queryType = QueryResolver.resolve(data.query)
        let message = ''
        const result = await client.player.search(data.query, {
            requestedBy: message.author,
            searchEngine: queryType
        })
        if (result.playlist) {
            const playlist = result.playlist
            const tracks = result.tracks.slice(0, 200)
            await queue.addTracks(tracks)
            message = `${ playlist.title } with ${tracks.length} songs added !`
            console.log('playlist loaded', data.guild);
        }
        else {
            const track = result.tracks[0]
            await queue.addTrack(track)
            message = `${ track.title } added !`
            console.log('track loaded', data.guild);
        } 
        if (!queue.playing) await queue.play()
        client.socket.emit("serverSendQueueMessage", {
            guild: data.guild,
            message: message
        })
        client.getQueueStatus(data.guild)
    } catch (error) {
        console.log(error)
    }
})

client.socket.on("getStatus", async guildId => {
    client.getQueueStatus(guildId)
})