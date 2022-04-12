const Command = require('../structures/Command')
const moment = require("moment");
require("moment-duration-format");

module.exports = new Command({
	name: "uptime", 
    aliases: "up",
	description: "uptime bot", 
	usage: "uptime",
	async run(message, args, client) {
		const duration = moment.duration(client.uptime).format(" D [days], H [hours], m [minutes], s [seconds]");
        message.channel.send(`Bot Uptime : **${duration}**`);
	}
})