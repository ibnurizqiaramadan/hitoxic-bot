const Command = require('../structures/Command')
const { MessageEmbed } = require("discord.js")

module.exports = new Command({
	name: "avatar", 
	description: "get player avatar", 
	async run(message, args, client) {
		let colorEmbed, authorUrl;
        if (message.member.displayColor) {
            colorEmbed = message.member.displayColor
        } else {
            colorEmbed = 3447003
        }
		// console.log(message.author);
        authorUrl = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=1024`
        function kirim(avatar, title) {
            message.channel.send({
				embeds: [
					new MessageEmbed()
						.setTitle(title)
						.setURL(avatar)
						.setFooter({
							iconURL: authorUrl,
							text: `Requested by ${message.author.tag}`
						})
						.setImage(avatar)
				]
			})
        }
        if (args.length > 1) {
            let userId;
            args.forEach(item => {
                if (item == "server") {
                    avatarURL = message.guild.iconURL();
                    kirim(avatarURL, "Icon Server Url");
                } else {
                    if (!/[<@!&>]/.test(item)) return
                    userId = item.replace(/[<@!&>]/g, '');
                    message.guild.members.fetch(userId).then(userData => {
                        avatarURL = `https://cdn.discordapp.com/avatars/${userData.user.id}/${userData.user.avatar}.png?size=1024`;
                        kirim(avatarURL, `Avatar Url for ${userData.user.username}`);
                    })
                }
            });
        } else {
            kirim(authorUrl, `Avatar Url for ${message.author.tag}`)
        }
	}
})