const {WARN_MESSAGE} = require('../config.json')

module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute(message, args) {
        message.reply(`PONG !\nping ke Server ** ${message.guild} ** ${Date.now() - message.createdTimestamp} ms`)
    },
};