const Command = require('../structures/Command')

module.exports = new Command({
	name: "pilih", 
    aliases: "pil",
	description: "Random Chooses", 
    usage: "pilih choice1 atau choice2 atau choice3",
	async run(message, args, client) {
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
        let pilihan = message.content.substr(args[0].length + client.prefix.length, message.content.length), pesan = ''
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
        message.reply(`${pesan + katanya[kata].replace("%PILIHAN%", pilihan[chance].trim())}`)
	}
})