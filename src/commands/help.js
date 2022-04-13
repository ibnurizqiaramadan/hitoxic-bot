const Command = require('../structures/Command')
const { MessageEmbed } = require("discord.js")

module.exports = new Command({
	name: "help", 
    aliases: "h",
	description: "Show help page", 
    usage: "help [page]",
	async run(message, args, client) {
        const icon = `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png`
        const iconUser = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
		const commands = client.commands
        const totalPages = Math.ceil(commands.size / 10) || 1

        const page = (args[1] || 1) - 1

        if (page + 1 > totalPages) 
            return await message.channel.send(`Invalid Page. There are only a total of ${totalPages} pages of helps`)

        const commandsArray = Array.from(commands, ([name, value]) => ({ name, value }))
        let fields = []
        let helpString = ""
        commandsArray.slice(page * 10, page * 10 + 10).map((value, i) => {
            const help = value.value
            fields.push({
                name:"",
                value: "asd"
            })
            helpString += `**${page * 10 + i + 1}.** **${help.name} | ${help.aliases ?? '-'} **\nUsage: \`${client.prefix}${help.usage}\`\n${help.description}\n\n`
        })
        // .join("\n\n")
        console.log(helpString);
        message.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Command List ${client.user.tag}`)
                    .setThumbnail(icon)
                    .setDescription(
                        `${helpString}`
                    )
                    .setFooter({
                        text: `Page ${page + 1} of ${totalPages}`
                    })
                    .setFooter({text: `Page ${page + 1} of ${totalPages} | Requested by ${message.author.tag}`, iconURL: iconUser})
            ]
        })
	}
})