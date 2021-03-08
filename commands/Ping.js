module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute(msg, args) {
        msg.reply(`PONG !\nping ke Server ** ${msg.guild} ** ${Date.now() - msg.createdTimestamp} ms`)
    },
};