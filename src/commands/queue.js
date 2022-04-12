const Command = require('../structures/Command')
const { MessageEmbed } = require("discord.js")

module.exports = new Command({
	name: "queue", 
    aliases: "q",
	description: "Skip song", 
	async run(message, args, client) {
		const queue = client.player.getQueue(message.guildId)
        if (!queue || !queue.playing){
            return await message.reply("There are no songs in the queue")
        }

        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (args[1] || 1) - 1

        if (page + 1 > totalPages) 
            return await message.channel.send(`Invalid Page. There are only a total of ${totalPages} pages of songs`)
        
        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy?.id}>`
        }).join("\n")

        const currentSong = queue.current

        await message.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`**Currently Playing**\n` + 
                    (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy?.id}>` : "None") +
                    `\n\n**Queue**\n${queueString}`
                    )
                    .setFooter({
                        text: `Page ${page + 1} of ${totalPages}`
                    })
                    .setThumbnail(currentSong.setThumbnail)
            ]
        })
    }
})