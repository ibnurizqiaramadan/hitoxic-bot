const Command = require('../structures/Command')
const { Permissions, MessageEmbed } = require("discord.js")

module.exports = new Command({
    name: "invite",
    aliases: "inv",
    description: "Invite the Bot",
    usage: "invite",
    async run(message, args, client) {
        const icon = `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png`
        const iconUser = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
        const link = client.generateInvite({
            permissions: [
                Permissions.FLAGS.ADMINISTRATOR,
            ],
            scopes: ['bot', 'applications.commands'],
        });

        message.reply({
            embeds: [
                new MessageEmbed()
                .setAuthor({
                    name: client.user.tag,
                    iconURL: icon
                })
                .setTitle(`Click to Invite`)
                .setURL(link)
                .setThumbnail(icon)
                .setDescription(`Invite the bot to your server !\n**${client.guilds.cache.size}** server & **${client.users.cache.size}** users using the bot`)
                .setFooter({text: `Requested by ${message.author.tag}`, iconURL: iconUser})
                .setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`)
            ]
        })
    }
})