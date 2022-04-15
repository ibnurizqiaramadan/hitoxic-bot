const Command = require('../structures/Command')

module.exports = new Command({
	name: "playlist", 
    aliases: "pl",
	description: "Play youtube playist or spotify playlist (no longer used)", 
    usage: "playlist <url>",
	async run(message, args, client) {
		message.reply(`use ${client.prefix}play instead of ${client.prefix}playlist`)
	}
})