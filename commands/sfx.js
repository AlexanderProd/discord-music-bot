const f = require('../functions.js');

module.exports = {
  name: 'sfx',
  description: "I'm playing a sound effect e.g. boi sfx horns.",
  usage: '<e.g. bruh>',
  execute(message, args) {
    console.log(f.t() + message.author.tag + ` used the sfx command`);

    isReady = false;
    const voiceChannel = message.member.voice.channel;

    voiceChannel
      .join()
      .then((connection) => {
        console.log(f.t() + `Playing sfx file ${args[0]}.mp3`);
        const dispatcher = connection.play(`./audio/${args[0]}.mp3`);

        connection.on('error', (e) => console.log(e));
        connection.on('debug', (d) => console.log(d));
        dispatcher.on('end', () => {
          voiceChannel.leave();
        });
      })
      .catch((err) => console.log(err));
    isReady = true;
  },
};
