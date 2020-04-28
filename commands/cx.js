const ytdl = require('ytdl-core');
const f = require('../functions.js');

module.exports = {
    name: 'cx',
    description: 'Spielt qualitativen content.',
    execute(message, args) {
      console.log(f.t()+message.author.tag+` used the cx command`);

      if (message.channel.type !== 'text') return;

      const voiceChannel = message.member.voice.channel;

      if (!voiceChannel) {
          return message.reply('please join a voice channel first!');
      }

      voiceChannel.join().then(connection => {
          console.log(f.t()+'Playing cx.')
          const stream = ytdl('https://www.youtube.com/watch?v=2g30Xu_IV7Y', { filter: 'audioonly' });
          const dispatcher = connection.play(stream);

          dispatcher.on('end', () => voiceChannel.leave());
      });

    },
};
