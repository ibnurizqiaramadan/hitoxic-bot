const Command = require('../structures/Command')

module.exports = new Command({
	name: "skip", 
    aliases: "s",
	description: "Skip musik", 
	async run(message, args, client) {
		if (!message.member.voice.channel) return message.reply(`Kamu harus masuk voice channel`)
        const queue = await client.player.getQueue(message.guild)
		if (!queue) return await message.reply("Tidak ada list musik")
        queue.skip()
	}
})