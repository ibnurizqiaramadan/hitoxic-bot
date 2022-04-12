const Command = require('../structures/Command')

module.exports = new Command({
	name: "play", 
    aliases: "p",
	description: "Play music on youtube link", 
    usage: "play <youtube video url>",
	async run(message, args, client) {
		if (!message.member.voice.channel) return message.reply(`You must be on the voice channel`)

        const queue = await client.player.createQueue(message.guild)
		if (!queue.connection) await queue.connect(message.member.voice.channel)
        const query = args.join(' ')
        const result = await client.player.search(query, {
            requestedBy: message.author,
        })
        if (result.tracks.length === 0) return message.reply(`No result !`)
        let song = result.tracks[0]
        await queue.addTrack(song)
        message.reply(`**${ song.title }** added !`)
        if (!queue.playing) await queue.play()
	}
})