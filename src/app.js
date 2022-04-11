const dotenv = require('dotenv')
dotenv.config();
const Client = require('./structures/Clients')
const client = new Client()
console.log("Starting Bot . . .")

client.start(process.env.BOT_TOKEN2)

client.player.on("trackStart", queue => {
    const track = queue.current
    if (!queue.repeatMode == 3) client.channels.cache.get(track.channel).send(`Sedang memutar **${ track.title }**`)
})

client.player.on("trackAdd", queue => {
    const track = queue.tracks[0]
    client.channels.cache.get(track.channel).send(`**${ track.title }** berhasil ditambahkan`)
})