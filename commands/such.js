const ytdl = require('ytdl-core');
const YouTube = require("discord-youtube-api");
const { prefix, token, youtubeApiToken } = require('./../config.json');
const youtube = new YouTube(youtubeApiToken);

module.exports = {
    name: 'such',
    description: 'Suche YouTube Video.',
    async execute(message, args) {

      isReady = false;
      var video = await youtube.searchVideos(args.toString().replace(/,/g,' '));
      console.log(video.url);
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
        isReady = true;
      });

    },
};
