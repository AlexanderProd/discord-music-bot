const ytdl = require('ytdl-core');
const YouTube = require("discord-youtube-api");
const { prefix, token, youtubeApiToken } = require('./../config.json');
const youtube = new YouTube(youtubeApiToken);
const f = require('../functions.js');

module.exports = {
    name: 'spiel',
    description: 'Spiel ein YouTube Video ab oder suche nach einem!',
    usage: '<youtube link oder suche>',
    async execute(message, args) {
      console.log(f.t()+message.author.tag+` used the spiel command`);

      if(args[0].includes("http")){
        console.log(f.t()+"Playing YouTube video " + args[0]);

        if (message.channel.type !== 'text') return;
        const { voiceChannel } = message.member;

        if (!voiceChannel) {
          return message.reply('Geh in einen Voice Channel!');
        }

        voiceChannel.join().then(connection => {
          const stream = ytdl(`${args[0]}`, { filter: 'audioonly' });
          const dispatcher = connection.play(stream);

          dispatcher.on('end', () => args[1].includes("loop") ? this.execute(message, args) : voiceChannel.leave());
        });

      } else {

        var video = await youtube.searchVideos(args.join(" "));
        console.log(f.t()+"Searching for " + args.join(" ") + " on YouTube");
        console.log(f.t()+"Playing: "+video.url);
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
