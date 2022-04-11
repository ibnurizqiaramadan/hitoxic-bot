const Command = require('../structures/Command')
const { QueryType } = require("discord-player")

module.exports = new Command({
	name: "play", 
    aliases: "p",
	description: "PLay music on youtube link", 
	async run(message, args, client) {
		if (!message.member.voice.channel) return message.reply(`Kamu harus masuk voice channel`)

        const queue = await client.player.createQueue(message.guild)
		if (!queue.connection) await queue.connect(message.member.voice.channel)
        const query = args.join(' ')
        const result = await client.player.search(query, {
            requestedBy: message.author.id,
            channel: message.channel
            // searchEngine: QueryType.YOUTUBE_VIDEO
        })
        let song = result.tracks[0]
        song.channel = message.channelId
        song.guild = message.guildId
        await queue.addTrack(song)
        if (!queue.playing) await queue.play()
	}
})