const ytdl = require('ytdl-core');
const YouTube = require('discord-youtube-api');
const { youtubeApiToken } = require('../config.json');
const youtube = new YouTube(youtubeApiToken);
const f = require('../functions.js');

module.exports = {
  name: 'play',
  description: 'Plays a video from a YouTube link or search.',
  usage: '<youtube link or search>',
  async execute(message, args) {
    console.log(f.t() + message.author.tag + ` used the spiel command`);

    if (args[0].includes('http')) {
      console.log(f.t() + 'Playing YouTube video ' + args[0]);

      if (message.channel.type !== 'text') return;
      const { voiceChannel } = message.member;

      if (!voiceChannel) {
        return message.reply('Get in a voice channel!');
      }

      voiceChannel.join().then(connection => {
        const stream = ytdl(`${args[0]}`, { filter: 'audioonly' });
        const dispatcher = connection.play(stream);

        dispatcher.on('end', () => voiceChannel.leave());
      });
    } else {
      const video = await youtube.searchVideos(args.join(' '));
      console.log(f.t() + 'Searching for ' + args.join(' ') + ' on YouTube');
      console.log(f.t() + 'Playing: ' + video.url);
      message.channel.send('Ich spiele ' + video.url);

      if (message.channel.type !== 'text') return;

      const { voiceChannel } = message.member;

      if (!voiceChannel) {
        return message.reply('Get in a voice channel.');
      }

      voiceChannel.join().then(connection => {
        const stream = ytdl(String(video.url), { filter: 'audioonly' });
        const dispatcher = connection.play(stream);

        dispatcher.on('end', () => voiceChannel.leave());
      });
    }
  },
};
