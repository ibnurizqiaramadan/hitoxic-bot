const Discord = require('discord.js')
const Client = require('./Clients')
/**
 * 
 * @param {Discord.Message | Discord.Interaction} message 
 * @param {string[]} args 
 * @param {Client} client 
 */
function RunFunction(message, args, client) {}

class Command {

    /**
     * @typedef {{name: string, description: string, run: RunFunction}} CommandOptions
     * @param {CommandOptions} options 
     */
    constructor(options) {
        this.name = options.name
        this.aliases = options.aliases
        this.description = options.description
        this.usage = options.usage
        this.run = options.run
    }
}

module.exports = Command