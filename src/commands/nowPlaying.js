const Command = require('../structures/Command')

module.exports = new Command({
	name: "nowplaying", 
	aliases: "np",
	description: "Display current playing song", 
	usage: "nowplaying",
	async run(message, args, client) {
		try {
			if (!message.member.voice.channel) return message.reply(`You must be on the voice channel`)
			const queue = await client.player.getQueue(message.guild)
			if (!queue) return await message.reply("Queue is empty")

			const bar = queue.createProgressBar({
				queue: false,
				length: 19,
			})

			const time = queue.getPlayerTimestamp()

			const song = queue.current

			await message.reply({
				embeds: [client.MessageEmbed
					.setThumbnail(song.thumbnail)
					.setDescription(`Currently playing [${song.title}](${song.url})\n\n${time.current} ${bar} ${time.end}`)
				],
			})
		} catch (error) {
			message.reply(`❌ Error while processing the action`)	
		}
	}
})