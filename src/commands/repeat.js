const Command = require('../structures/Command')

module.exports = new Command({
	name: "repeat", 
    aliases: "re",
	description: "Repeat queue", 
	async run(message, args, client) {
		if (!message.member.voice.channel) return message.reply(`You must be on the voice channel`)
        const queue = await client.player.getQueue(message.guild)
		if (!queue) return await message.reply("Queue is empty")
        if (args[1] == "off") return queue.setRepeatMode(0) && message.reply(`Repeat off`)
        if (args[1] == "on") return queue.setRepeatMode(2) && message.reply(`Repeat on`)
        if (args[1] == "auto") return queue.setRepeatMode(3) && message.reply(`Repeat auto`)
		return message.reply(`Invalid choose!\navailable chooses: **off, on, auto**`)
	}
})