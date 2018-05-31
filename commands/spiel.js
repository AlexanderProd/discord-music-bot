const ytdl = require('ytdl-core');

module.exports = {
    name: 'spiel',
    description: 'Spiel ein YouTube Video ab!',
    execute(message, args) {

      isReady = false;
      if (message.channel.type !== 'text') return;

      const { voiceChannel } = message.member;

      if (!voiceChannel) {
        return message.reply('please join a voice channel first!');
      }

      voiceChannel.join().then(connection => {
        const stream = ytdl(`${args[0]}`, { filter: 'audioonly' });
        const dispatcher = connection.playStream(stream);

        dispatcher.on('end', () => voiceChannel.leave());
        isReady = true;
      });

    },
};
