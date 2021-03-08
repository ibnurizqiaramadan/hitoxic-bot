module.exports = {
    name: "avatar",
    description: "Get Avatar",
    execute(message, args) {
        let colorEmbed, authorUrl;
        if (message.member.displayColor) {
            colorEmbed = message.member.displayColor
        } else {
            colorEmbed = 3447003
        }
        authorUrl = message.author.avatarURL({
            format: "png",
            dynamic: true,
            size: 1024
        })
        function kirim(avatar, title) {
            message.channel.send({
                embed: {
                    color: colorEmbed,
                    footer: {
                        icon_url: authorUrl,
                        text: `Requested by ${message.author.tag}`
                    },
                    author: {
                        name: message.author.tag
                    },
                    title: title,
                    url: avatar,
                    image: {
                        url: avatar
                    }
                }
            })
        }
        if (args.length > 0) {
            let userId;
            args.forEach(item => {
                if (item == "server") {
                    avatarURL = message.guild.iconURL();
                    kirim(avatarURL, "Icon Server Url");
                } else {
                    userId = item.replace(/[<@!&>]/g, '');
                    message.guild.members.fetch(userId).then(userData => {
                        avatarURL = `https://cdn.discordapp.com/avatars/${userData.user.id}/${userData.user.avatar}.png?size=1024`;
                        kirim(avatarURL, `Avatar Url for ${userData.user.username}`);
                    })
                }
            });
        } else {
            kirim(authorUrl, "Avatar Url")
        }
    }
}
