const Command = require('../structures/Command')

module.exports = new Command({
	name: "skipto",
	aliases: "sto",
	description: "Skip to track number n",
	usage: "skipto <number>",
	async run(message, args, client) {
		try {
			if (!message.member.voice.channel) return message.reply(`You must be on the voice channel`)
			const queue = await client.player.getQueue(message.guild)
			if (!queue) return await message.reply("Queue is empty")
			const currentSong = queue.current
			await queue.skipTo(args[1] - 1)
			message.reply(`**${currentSong.title}** skipped ahead to track number ${args[1]}!`)
		} catch (error) {
			console.log(error)
			message.reply(`❌ Error : **${error?.statusCode ?? "Unknown"}**`)
		}
	}
})