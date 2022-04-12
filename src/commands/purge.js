const Command = require('../structures/Command')

module.exports = new Command({
	name: "purge", 
    aliases: "pg",
	description: "Clear queue", 
	usage: "purge",
	async run(message, args, client) {
		if (!message.member.voice.channel) return message.reply(`You must be on the voice channel`)
        const queue = await client.player.getQueue(message.guild)
		if (!queue) return await message.reply("Queue is empty")
		const currentSong = queue.current
        await queue.clear()
		message.reply(`Queue has been purged !`)
	}
})