const Engine = require("./system/Engine.js")
const {
    WARN_MESSAGE,
    USER_MESSAGE,
    PREFIX
} = require('./config.json')
const bot = require("./system/Bot")
const engine = new Engine()

async function cekKata(message, messageUpdate = false) {
    return new Promise(async callback => {
        const words = bot.guildsData[message.guild.id].words
        const hasilPesan = engine.setMessage(message)
            .setLowerCase()
            .removeUrl()
            .removeMention()
            .removeMentionChannel()
            .removeEmoji()
            .removeSpace()
            .removeIgnore(words['ignore'] ?? [])
            .removeDuplicate()
            .checkBad(words['bad'] ?? [])
            .result()
        const attachments = messageUpdate == !1 ? hasilPesan.attachments : []
        const type = messageUpdate == !0 ? 3 : 0
        const simpanPesan = await engine.storeMessages(message, {attachments: attachments, type: type })
        console.log(simpanPesan)
        callback(hasilPesan)
    })
}

async function cekHasil(message, messageUpdate = false) {
    return new Promise(async callback => {
        const hasilCek = await cekKata(message, messageUpdate)
        if (hasilCek.bad.length > 0) {
            message.delete({
                timeout: 100
            })
            let badwords = hasilCek.bad
            let postData = await engine.storeMessages(message, {
                type: 1,
                attachments: hasilCek.attachments
            })
            console.log('Insert Badword :');
            console.log(postData)
            message.reply(`Jangan menggunakan kata ~~**${badwords}**~~ ya !`).then(msg => {
                msg.delete({
                    timeout: WARN_MESSAGE
                })
            })
            bot.membersData[message.guild.id].members[message.author.id] = {
                username: message.author.tag,
                badToday: +1,
                badCount: +1
            }
            console.log(bot.membersData[message.guild.id].members[message.author.id])
        }
        callback(hasilCek)
    })
}

async function cekMember(message) {
    return new Promise(callback => {
        const members = bot.membersData[message.guild.id].members ?? []
        callback(members[message.author.id] ?? false)
    })
}

async function cekChannel(message) {
    return new Promise(callback => {
        const channels = bot.guildsData[message.guild.id].channels.list ?? []
        callback(channels[message.channel.id] ?? false)
    })
}

async function cekGuild(message) {
    return new Promise(callback => {
        const guilds = bot.guildsData ?? []
        callback(guilds[message.guild.id] ?? false)
    })
}

function startCommand(message) {
    const args = message.content.split(/ +/)
    const command = args.shift().toLowerCase().replace(PREFIX, '')
    if (message.content.startsWith(PREFIX)) {
        message.delete({timeout: USER_MESSAGE})
        if (!bot.commands.has(command)) return
        try {
            switch (command) {
                case "uptime":
                    bot.commands.get(command).execute(message, args, bot.uptime)
                    break;
                default:
                    bot.commands.get(command).execute(message, args, PREFIX + command)
                    break;
            }
        } catch (error) {
            console.error(error)
            msg.reply('Error saat menjalankan perintah ! :(')
        }
    }
}

async function cekMemberMuted(message) {
    return new Promise(callback => {
        const muted = bot.membersData[message.guild.id].members[message.author.id].muted
        callback(muted)
    })
}

bot.on('message', async message => {
    if (!message.guild) return
    if (message.author.bot) return
    const guild = await cekGuild(message)
    if (guild == false) {
        const guildAdd = await engine.addGuilds(message)
        if (bot.guildsData[message.guild.id] == null) bot.guildsData[message.guild.id] = []
        bot.guildsData[message.guild.id] = {
            name: message.guild.name,
            words: {
                bad: null,
                ignore: null
            },
            channels: {
                log: null,
                ignore: null,
                lock: null,
                list: null
            },
            members: {
                muted: null,
                afk: null
            }
        };
        bot.membersData[message.guild.id] = {
            members: []
        }
        console.log(guildAdd)
        console.log(bot.guildsData[message.guild.id])
    }
    const member = await cekMember(message)
    if (member == false) {
        const memberAdd = await engine.addMembers(message)
        const memberGuild = await engine.addMembersGuild(message)
        if (bot.membersData[message.guild.id].members == null) bot.membersData[message.guild.id].members = []
        bot.membersData[message.guild.id].members[message.author.id] = {
            username: message.author.tag,
            badToday: 0,
            badCount: 0
        }
        console.log(memberAdd)
        console.log(memberGuild)
        console.log(bot.membersData[message.guild.id])
    }
    const channel = await cekChannel(message)
    if (channel == false) {
        const channelAdd = await engine.addChannels(message)
        const channelGuild = await engine.addChannelsGuild(message)
        if (bot.guildsData[message.guild.id].channels.list == null) bot.guildsData[message.guild.id].channels.list = []
        bot.guildsData[message.guild.id].channels.list[message.channel.id] = message.channel.name
        console.log(channelAdd)
        console.log(channelGuild)
    }
    const muted = await cekMemberMuted(message)
    if (muted == !0) return message.delete({timeout:10})
    const hasil = await cekHasil(message)
    if (hasil.bad <= 0) startCommand(message)
    console.log('\n\n--- NEW MESSAGE ---');
    console.log(`${message.guild.name} => ${message.channel.name}`);
    console.log(`User => ${message.author.tag}`);
    console.log(hasil);
})

bot.on('messageUpdate', async function (oldMessage, newMessage) {
    if (!newMessage.guild) return
    if (newMessage.author.bot) return
    const hasil = await cekHasil(newMessage, true)
    console.log('\n\n--- UPDATE MESSAGE ---');
    console.log(`${newMessage.guild.name} => ${newMessage.channel.name}`);
    console.log(`User => ${newMessage.author.tag}`);
    console.log(`Old Message => ${oldMessage}`);
    console.log(hasil);
})

bot.on('messageDelete', async message => {
    if (!message.guild) return
    if (message.author.bot) return
    console.log('\n\n--- DELETE MESSAGE ---');
    console.log(`${message.guild.name} => ${message.channel.name}`);
    console.log(`User => ${message.author.tag}`);
    console.log(`Deleted Messages => ${message}`);
})