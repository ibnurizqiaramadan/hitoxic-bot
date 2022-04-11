const Event = require('../structures/Events')

module.exports = new Event('ready', client => {
    console.log(`bot ready with prefix: ${client.prefix}`);
})