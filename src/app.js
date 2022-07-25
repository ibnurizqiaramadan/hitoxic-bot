const Client = require("./structures/Clients");
const { QueryResolver } = require("discord-player");
const client = new Client();
console.log("Starting Bot . . .");
client.start();

client.webControl.get("/", (req, res) => {
    res.send(":)");
});

client.webControl.get("/:serverId", async (req, res) => {
    try {
        const urlParam = Buffer.from(req.params.serverId, "base64")
            .toString("ascii")
            .split(".");
        const queue = await client.player.getQueue(urlParam[0]);
        const tracks = queue.tracks;
        if (!queue)
            return res.json({
                message: "Queue empty",
            });
        return res.render("webControl", {
            socketUrl: process.env.WEBCONTROL_SOCKET,
            time: Date.now(),
            server: queue.guild,
            tracks: tracks,
            currentSong: queue.current,
        });
    } catch (error) {
        if ((error.code = "UnknownGuild")) return res.render("404");
        res.send(error);
    }
});

client.player.on("trackStart", (queue) => {
    const track = queue.current;
    client.socket.emit("startTrack", {
        guild: queue.guild.id,
        track: track,
        queue: queue.tracks,
    });
    // `Playing **[${track.duration}]** **${track.author} - ${track.title}**`
    client.channels.cache
        .get(client.serverQueueSettings[queue.guild.id].channel)
        .send({
            embeds: [
                client.MessageEmbed.setThumbnail(
                    track.thumbnail
                ).setDescription(
                    `Playing [${track.title}](${track.url})\n\nRequested by ${
                        track.requestedBy?.id != undefined
                            ? `<@${track.requestedBy.id}>`
                            : `web control`
                    }`
                ),
            ],
        });
});

client.player.on("connectionError", (queue) => {
    try {
        client.player.voiceUtils.disconnect(queue.connection);
        queue.destroy();
    } catch (error) {
        console.log(error);
    }
});

client.on("voiceStateUpdate", async (oldState, newState) => {
    try {
        const queue = await client.player.getQueue(oldState.guild.id);
        if (!queue) return;
        if (newState.id == client.user.id && newState.channelId === null) {
            console.log(`bot disconnected`);
            await queue.destroy();
        }
        const currentGuild = await client.guilds.cache.find(
            (guild) => guild.id == queue.guild.id
        );
        const voiceChannel = await currentGuild.channels.cache.find(
            (chan) => chan.id == queue.connection.channel.id
        );
        const memberCount = voiceChannel.members.size;
        const lastMember = voiceChannel.members.first();
        if (memberCount == 1 && lastMember.id == client.user.id) {
            client.player.voiceUtils?.disconnect(queue.connection);
            await queue.destroy();
        }
    } catch (error) {
        console.log(error);
    }
});

client.socket.on("serverGetTime", async (guildId) => {
    try {
        const queue = await client.player.getQueue(guildId);
        client.socket.emit("serverSendTime", {
            guild: guildId,
            time: queue.getPlayerTimestamp(),
        });
    } catch (error) {}
});

client.socket.on("serverShuffleQueue", async (guildId) => {
    try {
        const queue = await client.player.getQueue(guildId);
        queue.shuffle();
        client.socket.emit("serverSendQueue", {
            guild: guildId,
            queue: queue.tracks,
        });
    } catch (error) {
        console.log(error);
    }
});

client.socket.on("serverNextQueue", async (guildId) => {
    try {
        const queue = await client.player.getQueue(guildId);
        queue.skip();
    } catch (error) {
        console.log(error);
    }
});

client.socket.on("serverPreviousQueue", async (guildId) => {
    try {
        const queue = await client.player.getQueue(guildId);
        queue.back();
    } catch (error) {}
});

client.socket.on("serverSeek", async (data) => {
    try {
        const queue = await client.player.getQueue(data.guild);
        queue.seek(data.seek);
    } catch (error) {
        console.log(error);
    }
});

client.socket.on("serverPlayPause", async (guildId) => {
    try {
        const queue = await client.player.getQueue(guildId);
        if (!client.musicPaused) {
            queue.setPaused(true);
            client.musicPaused = true;
        } else {
            queue.setPaused(false);
            client.musicPaused = false;
        }
        client.socket.emit("serverSendPlayRepeatStatus", {
            guild: guildId,
            status: {
                paused: client.musicPaused,
                repeat: queue.repeatMode,
            },
        });
    } catch (error) {
        console.log(error);
    }
});

client.socket.on("serverRepeat", async (guildId) => {
    try {
        const queue = await client.player.getQueue(guildId);
        if (queue.repeatMode == 0) {
            queue.setRepeatMode(2);
        } else {
            queue.setRepeatMode(0);
        }
        client.socket.emit("serverSendPlayRepeatStatus", {
            guild: guildId,
            status: {
                paused: client.musicPaused,
                repeat: queue.repeatMode,
            },
        });
    } catch (error) {
        console.log(error);
    }
});

client.socket.on("serverTrackSelected", async (data) => {
    try {
        const queue = await client.player.getQueue(data.guild);
        await queue.skipTo(data.position - 1);
    } catch (error) {
        console.log(error);
    }
});

client.socket.on("serverInputQuery", async (data) => {
    try {
        console.log(data);
        const { guild, query, payload } = data;
        const urlParam = Buffer.from(payload, "base64")
            .toString("ascii")
            .split(".");
        const queue = await client.player.createQueue(guild, {
            leaveOnEmptyCooldown: 1000 * 10,
            ytdlOptions: {
                quality: "highestaudio",
                highWaterMark: 1 << 25,
            },
        });
        if (!queue.connection) await queue.connect(urlParam[2]);
        const queryType = QueryResolver.resolve(query);
        let message = "";
        const result = await client.player.search(query, {
            requestedBy: message.author,
            searchEngine: queryType,
        });
        if (result.playlist) {
            const playlist = result.playlist;
            const tracks = result.tracks.slice(0, 200);
            await queue.addTracks(tracks);
            message = `${playlist.title} with ${tracks.length} songs added !`;
            console.log("playlist loaded", data.guild);
        } else {
            const track = result.tracks[0];
            await queue.addTrack(track);
            message = `${track.title} added !`;
            console.log("track loaded", data.guild);
        }
        if (!queue.playing) await queue.play();
        client.socket.emit("serverSendQueueMessage", {
            guild: data.guild,
            message: message,
        });
        client.getQueueStatus(data.guild);
    } catch (error) {
        console.log(error);
    }
});

client.socket.on("getStatus", async (guildId) => {
    client.getQueueStatus(guildId);
});

// client.on("messageReactionAdd", async (reaction, user) => {
//     // When a reaction is received, check if the structure is partial
//     if (reaction.partial) {
//         // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
//         try {
//             await reaction.fetch();
//         } catch (error) {
//             console.error(
//                 "Something went wrong when fetching the message:",
//                 error
//             );
//             // Return as `reaction.message.author` may be undefined/null
//             return;
//         }
//     }

//     // Now the message has been cached and is fully available
//     console.log(
//         `${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`
//     );
//     // The reaction is now also fully available and the properties will be reflected accurately:
//     console.log(
//         `${reaction.count} user(s) have given the same reaction to this message!`
//     );
// });
