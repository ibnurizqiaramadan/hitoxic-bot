const Command = require('../structures/Command')

module.exports = new Command({
	name: "resume", 
    aliases: "r",
	description: "Resume song", 
	usage: "resume",
	async run(message, args, client) {
		if (!message.member.voice.channel) return message.reply(`You must be on the voice channel`)
        const queue = await client.player.getQueue(message.guild)
		if (!queue) return await message.reply("Queue is empty")
        queue.setPaused(false)
		client.musicPaused = true
        message.reply(`Music has been resumed! Use **${client.prefix}pause** to pause the music`)
	}
})