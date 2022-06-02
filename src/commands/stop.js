const Command = require('../structures/Command')

module.exports = new Command({
	name: "stop",
	aliases: "st",
	description: "Stop song & clear queue",
	usage: "stop",
	async run(message, args, client) {
		try {
			if (!message.member.voice.channel) return message.reply(`You must be on the voice channel`)
			const queue = await client.player.getQueue(message.guild)
			if (!queue) return await message.reply("Queue is empty")
			await queue.stop()
			message.reply(`Queue has been cleared`)
		} catch (error) {
			console.log(error)
			message.reply(`❌ Error : **${error?.statusCode ?? "Unknown"}**`)
		}
	}
})