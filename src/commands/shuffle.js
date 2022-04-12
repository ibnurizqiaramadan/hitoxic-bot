const Command = require('../structures/Command')

module.exports = new Command({
	name: "shuffle", 
    aliases: "sf",
	description: "Shuffles the queue", 
	async run(message, args, client) {
		if (!message.member.voice.channel) return message.reply(`You must be on the voice channel`)
        const queue = await client.player.getQueue(message.guild)
		if (!queue) return await message.reply("Queue is empty")
        await queue.shuffle()
		message.reply(`The queue of **${queue.tracks.length}** songs have been shuffled!`)
	}
})