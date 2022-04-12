const Command = require('../structures/Command')

function Morse(huruf, pilihan) {
    huruf.toLowerCase();
    var alfabet = [" ", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "?", ".", ",", "@", "'", '"', "(", ")", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ":", "<", ">", "_", "-", "=", "[", "]", "!", "/", "&"],
        kodemorse = ["/", ".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..", ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--..", "..--..", ".-.-.-", "--..-", ".--.-", ".----.", ".-..-.", "-.--.", "-.--.-", ".----", "..---", "...--", "....-", ".....", "-....", "--...", "---..", "----.", "-----", "---...", "<", ">", "_", "-....-", "-...-", "", "", "-.-.--", "-..-.", ".-..."];
    if (1 == pilihan) {
        for (var i = 0; i < alfabet.length; i++)
            if (alfabet[i] == huruf) return kodemorse[i] + " "
    } else
        for (var i = 0; i < alfabet.length; i++)
            if (kodemorse[i] == huruf) return alfabet[i]
}

function KeMorse_(kata) {
    var morse = "";
    cek = !0;
    for (var i = 0; i < kata.length; i++) "[" == kata[i] && (cek = !1, i++), "]" == kata[i] && (cek = !0), 1 == cek ? morse += Morse(kata[i], 1) : morse += kata[i]
    return morse.replace(/undefined/g, "#")
}

function KeAlfabet_(kata) {
    for (var alfabet = "", kata_ = kata.split(" "), i = 0; i < kata_.length; i++) alfabet += Morse(kata_[i], 2)
    return alfabet.replace(/undefined/g, "#")
}

module.exports = new Command({
    name: "morse",
    aliases: "mor",
    description: "Morse code",
    async run(message, args, client) {
        let dm = false;
        let pesan = '';
        console.log(args[0]);
        const command = client.prefix.length + args[0].length
        let kata2 = message.content.substring((command + args[1].length + 2), message.content.length).toLowerCase();
        message.delete({
            timeout: 10
        })
        if (args[1] == "-f") {
            pesan = "Morse\n**" + kata2 + "**\nPesan\n**" + KeAlfabet_(kata2) + "**"
        } else if (args[1] == "-fdm") {
            pesan = "Morse\n**" + kata2 + "**\nPesan\n**" + KeAlfabet_(kata2) + "**"
            dm = true
        } else if (args[1] == "-fq") {
            pesan = "**" + message.author.tag + "** : " + KeAlfabet_(kata2)
        } else if (args[1] == "-fqq") {
            pesan = KeAlfabet_(kata2)
        } else if (args[1] == "-q") {
            pesan = "**" + message.author.tag + "** : " + KeMorse_(kata2)
        } else if (args[1] == "-qq") {
            pesan = KeMorse_(kata2)
        } else {
            kata2 = message.content.substring((command + 1), message.content.length)
            pesan = "Morse Dari **" + message.author.tag + "**\nPesan : \n||" + kata2 + "||\nMorse : \n**" + KeMorse_(kata2) + "**"
        }
        if (dm == false) {
            message.channel.send(pesan);
        } else {
            message.author.send(pesan)
        }
    }
})