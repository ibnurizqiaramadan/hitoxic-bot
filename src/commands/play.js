const Command = require("../structures/Command");
const { QueryResolver } = require("discord-player");

module.exports = new Command({
    name: "play",
    aliases: "p",
    description: "Play music on Youtube, Spotify or Soundcloud",
    usage: "play <url|title>",
    async run(message, args, client) {
        let msg = await message.reply(`🔃 Processing query...`);
        try {
            if (!message.member.voice.channel)
                return message.reply(`You must be on the voice channel`);
            const queue = await client.player.createQueue(message.guild, {
                leaveOnEmpty: false,
                leaveOnEnd: false,
                leaveOnStop: false,
                ytdlOptions: {
                    quality: "highestaudio",
                    highWaterMark: 1 << 25,
                },
            });
            if (!queue.connection)
                await queue.connect(message.member.voice.channel);
            client.serverQueueSettings[message.guild.id] = {
                channel: message.channel.id,
                voice: message.member.voice.channel,
            };
            const query = args.slice(1).join(" ");
            if (query.trim() == "") return msg.edit(
                `❌ Enter title or link !`
            );
            console.log(query);
            const arrayQuery = query.split("|")
            let counter = 0
            arrayQuery.forEach(async q => {
                const queryType = QueryResolver.resolve(q);
                const result = await client.player.search(q, {
                    requestedBy: message.author,
                    searchEngine: queryType,
                });
                // console.log(result);
                if (result.playlist) {
                    const playlist = result.playlist;
                    const tracks = result.tracks.slice(0, 200);
                    await queue.addTracks(tracks);
                    msg.edit(
                        `✅ **${playlist.title}** with **${tracks.length}** songs added !`
                    );
                    console.log(
                        "playlist loaded",
                        message.guild.id,
                        message.guild.name
                    );
                    counter++;
                } else {
                    const track = result.tracks[0];
                    await queue.addTrack(track);
                    msg.edit(`✅ **${track.title}** added !`);
                    console.log(
                        "track loaded",
                        message.guild.id,
                        message.guild.name
                    );
                    counter++;
                }
                if (counter == arrayQuery.length) {
                    if (!queue.playing) await queue.play();
                    client.getQueueStatus(message.guild.id);
                }
            })
        } catch (error) {
            console.error(error);
            msg.edit(`❌ Error : **${error?.statusCode ?? "Unknown"}**`);
        }
    },
});
