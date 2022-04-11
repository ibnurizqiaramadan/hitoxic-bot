const Discord = require('discord.js')
const intents = new Discord.Intents(32767)
const Command = require('./Command')
const Event = require('./Events')
const fs = require('fs')
const { Player } = require("discord-player")

class Client extends Discord.Client {
    constructor() {
        super({intents})

        /**
         * @type {Discord.Collection<string, Command>}
         */
        this.commands = new Discord.Collection()
        this.prefix  = process.env.PREFIX
        this.player = new Player(this, {
            ytdlOptions: {
                quality: "highestaudio",
                highWaterMark: 1 << 25
            },
        })
    }

    start(token) {
        fs.readdirSync('./src/commands').filter(file => file.endsWith('.js')).forEach(file => {
            /**
             * @type {Command}
             */
            const command = require(`../commands/${file}`)
            console.log(`Command ${command.name} loaded`);
            this.commands.set(command.name, command)
        })
        fs.readdirSync('./src/events').filter(file => file.endsWith('.js')).forEach(file => {
            /**
             * @type {Event}
             */
            const event = require(`../events/${file}`)
            console.log(`Events ${event.event} loaded`);
            this.on(event.event, event.run.bind(null, this))
        })
        this.login(token)
    }
}

module.exports = Client