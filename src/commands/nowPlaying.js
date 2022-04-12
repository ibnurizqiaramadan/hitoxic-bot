const Command = require('../structures/Command')
const { MessageEmbed } = require("discord.js")

module.exports = new Command({
	name: "nowplaying", 
	aliases: "np",
	description: "Display current playing song", 
	async run(message, args, client) {
		if (!message.member.voice.channel) return message.reply(`You must be on the voice channel`)
        const queue = await client.player.getQueue(message.guild)
		if (!queue) return await message.reply("Queue is empty")

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