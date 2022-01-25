const fs = require('fs')
const Discord = require('discord.js')
const Client = require('./Init')
const Engine = require('./Engine')
const bot = new Client()
const engine = new Engine()
bot.commands = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`../commands/${file}`)
    bot.commands.set(command.name, command)
}

console.log("Starting Bot . . .")

bot.on('ready', async () => {
    const guilds = await engine.getGuildSettings()
    const members = await engine.getMembersStatus()
    guilds.status == 'ok' && members.status == 'ok' ? (
        bot.guildsData = guilds.data ?? [],
        bot.membersData = members.data ?? [],
        console.log(bot.guildsData),
        console.log(bot.membersData),
        console.log("API url", process.env.API_URL),
        console.log("Bot Ready !")
    ) : (
        bot.destroy(),
        console.log(guilds),
        console.log('bot gagal berjalan :('),
        process.exit(1)
    )
})

bot.login(process.env.BOT_TOKEN)
module.exports = bot