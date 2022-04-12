const Command = require('../structures/Command')

module.exports = new Command({
	name: "resume", 
    aliases: "r",
	description: "Resume song", 
	async run(message, args, client) {
		if (!message.member.voice.channel) return message.reply(`You must be on the voice channel`)
        const queue = await client.player.getQueue(message.guild)
		if (!queue) return await message.reply("Queue is empty")
        queue.setPaused(false)
        message.reply(`Musik berhasil dilanjut, ketik **${client.prefix}pause** untuk jeda`)
	}
})