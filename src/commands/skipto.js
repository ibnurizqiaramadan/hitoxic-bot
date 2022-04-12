const Command = require('../structures/Command')

module.exports = new Command({
	name: "skipto", 
    aliases: "sto",
	description: "Skip to track number n", 
	async run(message, args, client) {
		if (!message.member.voice.channel) return message.reply(`You must be on the voice channel`)
        const queue = await client.player.getQueue(message.guild)
		if (!queue) return await message.reply("Queue is empty")
		const currentSong = queue.current
        await queue.skipTo(args[1] - 1)
		message.reply(`**${currentSong.title}** skipped ahead to track number ${args[1]}!`)
	}
})