const {
    PREFIX,
} = require('../config.json')

module.exports = {
    name: "pilih",
    description: "pilih salah satu atau lebih ?",
    execute(msg, args, command) {
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
        let pilihan = msg.content.substr(command.length + PREFIX.length, msg.content.length), pesan = ''
        pilihan = pilihan.replace(/atau/g, "|").split("|")
        pilihan = pilihan.filter(item => item != '')
        let katanya = [
            "Saya pilih %PILIHAN% dong",
            "Saya pilih %PILIHAN%",
            "Saya lebih memilih %PILIHAN%",
            "%PILIHAN% lah",
            "Aku maunya %PILIHAN%, gak mau yang lain",
            "Pastinya %PILIHAN% dong",
            "Aku sih sukanya %PILIHAN%",
            "karena terpaksa jadi aku pilih %PILIHAN%",
            "Aku pilihnya %PILIHAN%, b-bukan berarti Aku Suka ya...",
            "Pilih %PILIHAN% aja",
            "Pilih %PILIHAN% laaa~ boy"
        ]
        pilihan = shuffle(pilihan)
        pilihan = shuffle(pilihan)
        katanya = shuffle(katanya)
        let chance = Math.floor(Math.random() * pilihan.length)
        let kata = Math.floor(Math.random() * katanya.length)
        if (pilihan.length > 2) {
            pesan = `Dari ke-${pilihan.length} pilihan, `
        } 
        msg.reply(`${pesan + katanya[kata].replace("%PILIHAN%", pilihan[chance].trim())}`)
    }
}