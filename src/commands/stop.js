const Command = require('../structures/Command')

module.exports = new Command({
	name: "stop", 
    aliases: "st",
	description: "Stop musik & bersihkan antrian", 
	async run(message, args, client) {
		if (!message.member.voice.channel) return message.reply(`Kamu harus masuk voice channel`)
        const queue = await client.player.getQueue(message.guild)
		if (!queue) return await message.reply("Tidak ada list musik")
        await queue.destroy()
        message.reply(`Musik telah berhenti dan antrian telah dihapus`)
	}
})