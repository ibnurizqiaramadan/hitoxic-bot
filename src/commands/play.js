const Command = require('../structures/Command')
const { QueryResolver } = require("discord-player")

module.exports = new Command({
	name: "play", 
    aliases: "p",
	description: "Play music on youtube", 
    usage: "play <url|title>",
	async run(message, args, client) {
        let msg
		try {
            if (!message.member.voice.channel) return message.reply(`You must be on the voice channel`)
            const queue = await client.player.createQueue(message.guild, {
                leaveOnEmpty: false,
                leaveOnEnd: false,
                leaveOnStop: false,
                ytdlOptions: {
                    quality: "highestaudio",
                    highWaterMark: 1 << 25
                },
            })
            if (!queue.connection) await queue.connect(message.member.voice.channel)
            client.serverQueueSettings[message.guild.id] = {channel: message.channel.id}
            const query = args.slice(1).join(' ')
            console.log(query);
            msg = await message.reply(`🔃 Processing query...`)
            const queryType = QueryResolver.resolve(query)
            const result = await client.player.search(query, {
                requestedBy: message.author,
                searchEngine: queryType
            })
            // console.log(result);
            if (result.playlist) {
                const playlist = result.playlist
                const tracks = result.tracks.slice(0, 200)
                await queue.addTracks(tracks)
                msg.edit(`✅ **${ playlist.title }** with **${tracks.length}** songs added !`)
                console.log('playlist loaded', message.guild.id, message.guild.name);
            }
            else {
                const track = result.tracks[0]
                await queue.addTrack(track)
                msg.edit(`✅ **${ track.title }** added !`)
                console.log('track loaded', message.guild.id, message.guild.name);
            } 
            if (!queue.playing) await queue.play()
            client.getQueueStatus(message.guild.id)
        } catch (error) {
            console.error(error);
            msg.edit(`❌ Error : **${error?.statusCode ?? "Unknown"}**`)
        }
	}
})