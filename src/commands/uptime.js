const Command = require('../structures/Command')
const moment = require("moment");
require("moment-duration-format");

module.exports = new Command({
	name: "uptime", 
    aliases: "up",
	description: "uptime bot", 
	async run(message, args, client) {
		const duration = moment.duration(client.uptime).format(" D [hari], H [jam], m [menit], s [detik]");
        message.channel.send(`Bot Uptime : **${duration}**`);
	}
})