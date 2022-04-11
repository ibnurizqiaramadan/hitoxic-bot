const Discord = require('discord.js')
const Client = require('./Clients')

/**
 * @template {keyof Discord.ClientEvents} K 
 * @param {Client} client 
 * @param  {Discord.ClientEvents[K]}} eventArgs 
 */
function RunFunctioin(client, ...eventArgs) {}

/**
 * @template {keyof Discord.ClientEvents} K 
 */
class Event {
    /**
     * 
     * @param {K} event 
     * @param {RunFunction<K>} runFunction 
     */
    constructor(event, runFunction) {
        this.event = event, 
        this.run = runFunction
    }
}

module.exports = Event