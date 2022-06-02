const Command = require('../structures/Command')

module.exports = new Command({
	name: "leave",
	aliases: "l",
	description: "leave and clear queue",
	usage: "leave",
	async run(message, args, client) {
		try {
			if (!message.member.voice.channel) return message.reply(`You must be on the voice channel`)
			const queue = await client.player.getQueue(message.guild)
			if (!queue) return await message.reply("Queue is empty")
			await queue.destroy()
			client.player.voiceUtils.disconnect(queue.connection)
			message.reply(`Bye o(*^▽^*)┛`)
		} catch (error) {
			console.log(error)
			message.reply(`❌ Error : **${error?.statusCode ?? "Unknown"}**`)
		}
	}
})