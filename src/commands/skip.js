const Command = require('../structures/Command')

module.exports = new Command({
	name: "skip",
	aliases: "s",
	description: "Skip song",
	usage: "skip",
	async run(message, args, client) {
		try {
			if (!message.member.voice.channel) return message.reply(`You must be on the voice channel`)
			const queue = await client.player.getQueue(message.guild)
			if (!queue) return await message.reply("Queue is empty")
			const currentSong = queue.current
			await queue.skip()
			message.reply(`**${currentSong.title}** skipped !`)
		} catch (error) {
			console.log(error)
			message.reply(`❌ Error : **${error?.statusCode ?? "Unknown"}**`)
		}
	}
})