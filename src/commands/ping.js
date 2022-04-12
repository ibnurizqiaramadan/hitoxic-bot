const Command = require('../structures/Command')

module.exports = new Command({
	name: "ping", 
    aliases: "pi",
	description: "Ping", 
	usage: "ping",
	async run(message, args, client) {
		message.reply(`Ping: ${client.ws.ping} ms`)
	}
})