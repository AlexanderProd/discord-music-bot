const ytdl = require('ytdl-core');
const YouTube = require("discord-youtube-api");
const { prefix, token, youtubeApiToken } = require('./../config.json');
const youtube = new YouTube(youtubeApiToken);
const functions = require('../functions.js'), tt = functions.ctimestamp();

module.exports = {
    name: 'spiel',
    description: 'Spiel ein YouTube Video ab oder suche nach einem!',
    usage: '<youtube link oder suche>',
    async execute(message, args) {

      if(args[0].includes("http")){
        console.log(tt+"Playing YouTube video " + args[0]);

        if (message.channel.type !== 'text') return;
        const { voiceChannel } = message.member;

        if (!voiceChannel) {
          return message.reply('Geh in einen Voice Channel!');
        }

        voiceChannel.join().then(connection => {
          const stream = ytdl(`${args[0]}`, { filter: 'audioonly' });
          const dispatcher = connection.play(stream);

          dispatcher.on('end', () => voiceChannel.leave());
        });

      } else {

        var video = await youtube.searchVideos(args.join(" "));
        console.log(tt+"Searching for" + args.join(" ") + "on YouTube");
        console.log(tt+"Playing: "+video.url);
        message.channel.send("Ich spiele " + video.url);

        if (message.channel.type !== 'text') return;

        const { voiceChannel } = message.member;

        if (!voiceChannel) {
          return message.reply('Geh in einen Voice Channel!');
        }

        voiceChannel.join().then(connection => {
          const stream = ytdl(String(video.url), { filter: 'audioonly' });
          const dispatcher = connection.play(stream);

          dispatcher.on('end', () => voiceChannel.leave());
        });

      }

    },
};
