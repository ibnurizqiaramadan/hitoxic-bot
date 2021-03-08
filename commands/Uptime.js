const moment = require("moment");
require("moment-duration-format");

module.exports = {
    name: "uptime",
    description: "Uptime Bot",
    execute(msg, args, uptime){
        const duration = moment.duration(uptime).format(" D [hari], H [jam], m [menit], s [detik]");
        msg.channel.send(`Bot Uptime : **${duration}**`);
    }
}