const Command = require('../structures/Command')

module.exports = new Command({
	name: "pause",
	aliases: "pa",
	description: "Pause song",
	usage: "pause",
	async run(message, args, client) {
		try {
			if (!message.member.voice.channel) return message.reply(`You must be on the voice channel`)
			const queue = await client.player.getQueue(message.guild)
			if (!queue) return await message.reply("Queue is empty")
			queue.setPaused(true)
			client.musicPaused = true
			message.reply(`Music has been paused! Use **${client.prefix}resume** to resume the music`)
			client.getQueueStatus(message.guild.id)
		} catch (error) {
			console.log(error)
			message.reply(`❌ Error : **${error?.statusCode ?? "Unknown"}**`)
		}
	}
})