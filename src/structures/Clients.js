const Discord = require('discord.js')
const dotenv = require('dotenv')
const intents = new Discord.Intents(32767)
const Command = require('./Command')
const Event = require('./Events')
const fs = require('fs')
const { Player } = require("discord-player")
const express = require('express')
const { io } = require("socket.io-client")
const path = require('path')
dotenv.config();

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
        this.webControl = express()
        this.webControlPort = process.env.WEBCONTROL_PORT
        this.webControlUrl = process.env.WEBCONTROL_URL
        this.socket = io(process.env.WEBCONTROL_SOCKET)
        this.webControl.use(express.static('./src/public'))
        this.webControl.set('views', path.join(`./src`, 'views'))
        this.webControl.set('view engine', 'pug')
        this.musicPaused = false
        this.getQueueStatus = async function(guildId) {
            try {
                const queue = await this.player.getQueue(guildId)
                this.socket.emit("serverSendStatus", {
                    guild: guildId,
                    queue: queue.tracks,
                    track: {
                        paused: this.musicPaused,
                        repeat: queue.repeatMode
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }
    }

    start() {
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
        this.login(process.env.BOT_TOKEN2)
        this.webControl.listen(this.webControlPort, () => {
            console.log(`Web Control run on port ${this.webControlPort}`)
        })
        this.socket.on("connect", () => {
            console.log(`Socket.io connected to ${process.env.WEBCONTROL_SOCKET}`);
        })
        
    }
}

module.exports = Client