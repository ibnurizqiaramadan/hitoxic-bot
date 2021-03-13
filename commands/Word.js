const {BOT_MESSAGE, USER_MESSAGE, WARN_MESSAGE} = require('../config.json')
const Engine = require("../system/Engine.js")
const engine = new Engine()

module.exports = {
    name: "word",
    description: "mengelola kata-kata kasar dan diabaikan",
    async execute(message, args, command) {
        message.delete({timeout: USER_MESSAGE})
        const action = args[0]
        const words = message.content.substr(command.length + action.length + 2, message.content.length).replace(/\ /g, ',')
        console.log(words)
        if (words.trim() == '') return message.channel.send(`Anda belum memasukan kata yang akan dikirim ke server <:hmph:810339681509965864>`).then(msg => msg.delete({timeout: WARN_MESSAGE}))
        switch (action) {
            case 'add':
                const addWords = await engine.addWords(message, {words: words})
                console.log(addWords)
                addWords.status == 'ok' ? (message.channel.send(`:white_check_mark: ${addWords.created.length} kata berhasil dimasukan **${addWords.created.length > 0 ? addWords.created : '-'}**\n:no_entry: ${addWords.failed.length} kata gagal dimasukan **${addWords.failed.length > 0 ? addWords.failed : '-'}**`).then(msg => msg.delete({timeout: BOT_MESSAGE}))) : (message.channel.send(`:x: Kesalahan Server :(\n${addWords}`).then(msg => msg.delete({timeout: BOT_MESSAGE})))
                break
            case 'addignore':
                const addIgnoreWords = await engine.addWords(message, {words: words, type: 0})
                addIgnoreWords.status == 'ok' ? (message.channel.send(`:white_check_mark: ${addIgnoreWords.created.length} kata berhasil dimasukan **${addIgnoreWords.created.length > 0 ? addIgnoreWords.created : '-'}**\n:no_entry: ${addIgnoreWords.failed.length} kata gagal dimasukan **${addIgnoreWords.failed.length > 0 ? addIgnoreWords.failed : '-'}**`).then(msg => msg.delete({timeout: BOT_MESSAGE}))) : (message.channel.send(`:x: Kesalahan Server :(\n${addIgnoreWords}`).then(msg => msg.delete({timeout: BOT_MESSAGE})))
                break
            default:
                message.channel.send(`Pilihan **${action}** tidak tersedia <:hmph:810339681509965864>`).then(msg => msg.delete({timeout: BOT_MESSAGE}))
                break
        }
    }
}