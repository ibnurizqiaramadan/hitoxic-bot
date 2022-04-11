const Command = require('../structures/Command')

module.exports = new Command({
	name: "resume", 
    aliases: "r",
	description: "Resume musik", 
	async run(message, args, client) {
		if (!message.member.voice.channel) return message.reply(`Kamu harus masuk voice channel`)
        const queue = await client.player.getQueue(message.guild)
        console.log(queue);
		if (!queue) return await message.reply("Tidak ada list musik")
        queue.setPaused(false)
        message.reply(`Musik berhasil dilanjut, ketik **${client.prefix}pause** untuk jeda`)
	}
})