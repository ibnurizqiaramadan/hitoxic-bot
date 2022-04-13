const Command = require('../structures/Command')
const { QueryType } = require("discord-player")

module.exports = new Command({
	name: "playlist", 
    aliases: "pl",
	description: "Play playist on youtube", 
    usage: "playlist <youtube playlist url>",
	async run(message, args, client) {
		if (!message.member.voice.channel) return message.reply(`You must be on the voice channel`)
        const queue = await client.player.createQueue(message.guild)
		if (!queue.connection) await queue.connect(message.member.voice.channel)
        const query = args.join(' ')
        const result = await client.player.search(query, {
            requestedBy: message.author,
            searchEngine: QueryType.AUTO
        })

        if (result.tracks.length === 0) return message.reply("No results")
        const playlist = result.playlist
        await queue.addTracks(result.tracks)
        message.reply(`**${ playlist.title }** with **${result.tracks.length}** songs added !`)
        if (!queue.playing) await queue.play()
        client.getQueueStatus(message.guild.id)
	}
})