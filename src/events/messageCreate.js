const Event = require('../structures/Events')

module.exports = new Event('messageCreate', (client, message) => {
    if (!message.content.startsWith(client.prefix)) return
	const args = message.content.substring(client.prefix.length).split(/ +/)
	const command = client.commands.find(cmd => cmd.name == args[0] || cmd.aliases == args[0])
	if (!command) return message.reply(`Command not found :(`)
	command.run(message, args, client)
})	