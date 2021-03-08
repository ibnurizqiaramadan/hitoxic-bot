function Morse(huruf, pilihan) {
    huruf.toLowerCase()
    var alfabet = [" ", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "?", ".", ",", "@", "'", "\"", "(", ")", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ":", "<", ">", "_", "-", "=", "[", "]", "!", "/", "&"]
    var kodemorse = ["/", ".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..", ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--..", "..--..", ".-.-.-", "--..-", ".--.-", ".----.", ".-..-.", "-.--.", "-.--.-", ".----", "..---", "...--", "....-", ".....", "-....", "--...", "---..", "----.", "-----", "---...", "<", ">", "_", "-....-", "-...-", "", "", "-.-.--", "-..-.", ".-..."]
    if (pilihan == 1) {
        for (var i = 0; i < alfabet.length; i++) {
            if (alfabet[i] == huruf) {
                return kodemorse[i] + " "
            }
        }
    } else {
        for (var i = 0; i < alfabet.length; i++) {
            if (kodemorse[i] == huruf) {
                return alfabet[i]
            }
        }
    }
}

function KeMorse_(kata) {
    var morse = ""
    cek = true
    for (var i = 0; i < kata.length; i++) {
        if (kata[i] == "[") {
            cek = false
            i++
        }
        if (kata[i] == "]") {
            cek = true
        }
        if (cek == true) {
            morse += Morse(kata[i], 1)
        } else {
            morse += kata[i]
        }
    }
    return morse.replace(/undefined/g, "#")
}

function KeAlfabet_(kata) {
    var alfabet = ""
    var kata_ = kata.split(" ")
    for (var i = 0; i < kata_.length; i++) {
        alfabet += Morse(kata_[i], 2)
    }
    return alfabet.replace(/undefined/g, "#")
}

module.exports = {
    name: 'morse',
    description: 'Ubah kata ke morse atau sebaliknya!',
    execute(msg, args, command) {
        let dm = false;
        let pesan = '';
        let kata2 = msg.content.substring((command.length + args[0].length + 2), msg.content.length).toLowerCase();
        if (args[0] == "-f") {
            pesan = "Morse\n**" + kata2 + "**\nPesan\n**" + KeAlfabet_(kata2) + "**"
        } else if (args[0] == "-fdm") {
            pesan = "Morse\n**" + kata2 + "**\nPesan\n**" + KeAlfabet_(kata2) + "**"
            dm = true
        } else if (args[0] == "-fq") {
            pesan = "**" + msg.author.tag + "** : " + KeAlfabet_(kata2)
        } else if (args[0] == "-fqq") {
            pesan = KeAlfabet_(kata2)
        } else if (args[0] == "-q") {
            pesan = "**" + msg.author.tag + "** : " + KeMorse_(kata2)
        } else if (args[0] == "-qq") {
            pesan = KeMorse_(kata2)
        } else {
            kata2 = msg.content.substring((command.length + 1), msg.content.length)
            pesan = "Morse Dari **" + msg.author.tag + "**\nPesan : \n||" + kata2 + "||\nMorse : \n**" + KeMorse_(kata2) + "**"
        }
        if (dm == false) {
            msg.channel.send(pesan);
        } else {
            msg.author.send(pesan)
        }
    },
};