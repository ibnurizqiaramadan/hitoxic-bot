const Command = require('../structures/Command')

module.exports = new Command({
	name: "repeat", 
    aliases: "re",
	description: "Repeat musik", 
	async run(message, args, client) {
		if (!message.member.voice.channel) return message.reply(`Kamu harus masuk voice channel`)
        const queue = await client.player.getQueue(message.guild)
		if (!queue) return await message.reply("Tidak ada list musik")
        if (args[1] == "on") queue.setRepeatMode(2) && message.reply(`Repeat on`)
        if (args[1] == "off") queue.setRepeatMode(0) && message.reply(`Repeat off`)
	}
})