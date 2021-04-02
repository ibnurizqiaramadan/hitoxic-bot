var todSettings = []

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function playerlist(message) {
    let pl = 'Player List\n'
    todSettings[message.guild.id].players.forEach((player, index) => {
        pl += `${index + 1}. <@${player.id}>\n`
    })
    return pl
}

function cekStart(message) {
    let status
    return 1 == todSettings[message.guild.id]?.start ? status = !0 : (message.channel.send("Anda belum start TOD"), status = !1), status
}

function cekPlayer(message, playerId) {
    let ketemu = 0
    todSettings[message.guild.id].players.some(player => {
        if (player.id == playerId) ketemu++
        player.id == playerId
    })
    return ketemu > 0 ? true : false
}

module.exports = {
    name: "tod",
    description: "Truth or Dare",
    execute(message, args, command) {
        const action = args[0]
        switch (action) {
            case "start":
            case "s":
                if (todSettings[message.guild.id]?.startBy) return message.channel.send(`Tod berhasil dimulai oleh <@${todSettings[message.guild.id].startBy}>`)
                todSettings[message.guild.id] = {
                    start: true,
                    startBy: message.author.id,
                    played: false,
                    currentPlayer: 0,
                    spoiler: false,
                    truth: [],
                    dare: [],
                    players: []
                }
                message.channel.send("Berhasil memulai TOD")
                break
            case "stop":
            case "st":
                if (cekStart(message) == false) return
                if (startBy != message.author.id) return message.channel.send("Anda tidak dapat menutup TOD")
                startTod = false;
                startBy = 0
                message.channel.send("TOD selesai")
                break
            case "reset":
            case "r":
                if (cekStart(message) == false) return
                if (startBy != message.author.id) return message.channel.send("Anda tidak dapat mereset TOD")
                truthItem = []
                dareItem = []
                players = []
                message.channel.send("Berhasil mereset TOD")
                break
            case "status":
            case "stat":
                const start = todSettings[message.guild.id].start
                const dareCount = todSettings[message.guild.id].dare.length
                const truthCount = todSettings[message.guild.id].truth.length
                const playersCount = todSettings[message.guild.id].players.length
                message.channel.send(`Satus TOD : ${start == true ? 'Berjalan' : 'Berhenti'}\nDare : ${dareCount}\nTruth : ${truthCount}\nPlayers : ${playersCount}`)
                break
            case "adddare":
            case "ad":
                if (cekStart(message) == false) return
                if (!cekPlayer(message, message.author.id)) return message.channel.send('Kamu tidak ikutan gamenya :(')
                message.delete({
                    timeout: 10
                })
                dares = message.content.substr(command.length + action.length + 1, message.content.length).split(",")
                dares.forEach(dare => {
                    dare.trim() != '' && todSettings[message.guild.id].dare.push({id: message.author.id, dare: dare.trim()})
                })
                console.log(todSettings[message.guild.id].dare)
                message.channel.send(`${message.author} berhasil menambahkan ${dares.length} dare`)
                break
            case "addtruth":
            case "at":
                if (cekStart(message) == false) return
                if (!cekPlayer(message, message.author.id)) return message.channel.send('Kamu tidak ikutan gamenya :(')
                message.delete({
                    timeout: 10
                })
                truths = message.content.substr(command.length + action.length + 1, message.content.length).split(",")
                truths.forEach(truth => {
                    truth.trim() != '' && todSettings[message.guild.id].truth.push({id: message.author.id, truth: truth.trim()})
                })
                console.log(todSettings[message.guild.id].truth)
                message.channel.send(`${message.author} berhasil menambahkan ${truths.length} truth`)
                break
            case "dare":
            case "d":
                if (cekStart(message) == false) return
                if (todSettings[message.guild.id].dare.length == 0) return message.channel.send(`Dare sudah habis`)
                const chanceDare = Math.floor(Math.random() * todSettings[message.guild.id].dare.length)
                const dareData = todSettings[message.guild.id].dare[chanceDare]
                const spoilerDare = todSettings[message.guild.id].spoiler
                todSettings[message.guild.id].dare.splice(chanceDare, 1)
                message.channel.send(`${message.author} dapat dare dari ${spoilerDare == true ? `<@${dareData.id}>` : `anonim`}\n${dareData.dare}`)
                break
            case "truth":
            case "t":
                if (cekStart(message) == false) return
                if (todSettings[message.guild.id].truth.length == 0) return message.channel.send(`Truth sudah habis`)
                const chanceTruth = Math.floor(Math.random() * todSettings[message.guild.id].truth.length)
                const truthData = todSettings[message.guild.id].truth[chanceTruth]
                const spoilerTruth = todSettings[message.guild.id].spoiler
                todSettings[message.guild.id].truth.splice(chanceTruth, 1)
                message.channel.send(`${message.author} dapat truth dari ${spoilerTruth == true ? `<@${truthData.id}>` : `anonim`}\n${truthData.truth}`)
                break
            case "setspoiler":
            case "sp":
                const spoiler = todSettings[message.guild.id].spoiler
                todSettings[message.guild.id].spoiler = spoiler == false ? true : false
                message.channel.send(`Berhasil merubah spoiler ke : ${todSettings[message.guild.id].spoiler}`)
                break
            case "addplayer":
            case "ap":
                if (cekStart(message) == false) return
                if (todSettings[message.guild.id]?.startBy != message.author.id) return message.channel.send(`Anda tidak dapat menambah player selain yang memulai, yaitu <@${todSettings[message.guild.id]?.startBy}>`)
                if (todSettings[message.guild.id]?.played) return message.channel.send("TOD sudah berjalan")
                players = message.content.substr(command.length + action.length + 2, message.content.length).split(" ")
                players.forEach(player => {
                    const playerId = player.replace(/[<!@:>]/g, "")
                    const tod = ['truth', 'dare']
                    const chanceTod = Math.floor(Math.random() * tod.length)
                    if (!cekPlayer(message, playerId)) todSettings[message.guild.id].players.push({id:playerId, tod:tod[chanceTod]})
                })
                break
            case "playerlist":
            case "pl":
                if (cekStart(message) == false) return
                if (todSettings[message.guild.id].players.length == 0) return message.channel.send("belum ada player")
                message.channel.send(playerlist(message))
                break
            case "play":
            case "p":
                if (cekStart(message) == false) return
                if (todSettings[message.guild.id]?.played) return message.channel.send("TOD sudah berjalan")
                todSettings[message.guild.id].played = true
                message.channel.send(playerlist(message))
                const acakPlayer = shuffle(todSettings[message.guild.id].players)
                todSettings[message.guild.id].players = acakPlayer
                // playersItem = shuffle(playersItem)
                message.channel.send(playerlist(message))
                message.channel.send("played")
                break
            case "debug":
                console.log(todSettings)
                message.channel.send(`Debug send`)
                break
            default:
                message.channel.send("Menu tidak tersedia <:hmph:810339681509965864>")
                break
        }
    }
}