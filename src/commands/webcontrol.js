const Command = require('../structures/Command')
const { MessageEmbed } = require("discord.js")

module.exports = new Command({
	name: "webcontrol", 
    aliases: "wc",
	description: "Web Control for music", 
	usage: "webcontrol",
	async run(message, args, client) {
		if (!message.member.voice.channel) return message.reply(`You must be on the voice channel`)
        const queue = await client.player.getQueue(message.guild)
		if (!queue) return await message.reply("Queue is empty")
		const icon = `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png`
        const iconUser = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
		message.reply({
            embeds: [
                new MessageEmbed()
                .setAuthor({
                    name: client.user.tag,
                    iconURL: icon
                })
                .setTitle(`Click to open Web Control`)
                .setURL(`${process.env.WEBCONTROL_URL}/${message.guild.id}`)
                .setThumbnail(icon)
                .setDescription(`Invite the bot to your server !\n**${client.guilds.cache.size}** server & **${client.users.cache.size}** users using the bot`)
                .setFooter({text: `Requested by ${message.author.tag}`, iconURL: iconUser})
                .setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`)
            ]
        })
	}
})