const Command = require('../structures/Command')
const { MessageEmbed } = require("discord.js")

module.exports = new Command({
	name: "nowplaying", 
	aliases: "np",
	description: "Melihat musik yang sedang diputar", 
	async run(message, args, client) {
		const queue = client.player.getQueue(message.guildId)

		if (!queue) return await message.reply("Tidak ada list musik")

		let bar = queue.createProgressBar({
			queue: false,
			length: 19,
		})

        const song = queue.current

		await message.reply({
			embeds: [new MessageEmbed()
				.setThumbnail(song.thumbnail)
				.setDescription(`Sedang memutar [${song.title}](${song.url})\n\n` + bar)
        	],
		})
	}
})