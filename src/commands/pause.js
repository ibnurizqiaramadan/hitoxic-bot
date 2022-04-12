const Command = require('../structures/Command')

module.exports = new Command({
	name: "pause", 
    aliases: "pa",
	description: "Pause song", 
	usage: "pause",
	async run(message, args, client) {
		if (!message.member.voice.channel) return message.reply(`Kamu harus masuk voice channel`)
        const queue = await client.player.getQueue(message.guild)
        console.log(queue);
		if (!queue) return await message.reply("Tidak ada list musik")
        queue.setPaused(true)
        message.reply(`Music has been paused! Use **${client.prefix}resume** to resume the music`)
	}
})