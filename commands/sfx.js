const f = require('../functions.js');

module.exports = {
    name: 'sfx',
    description: 'Spielt einen Soundeffekt ab z.b. boi sfx horns.',
    usage: '<z.b. bruh>',
    execute(message, args) {
      console.log(f.t()+message.author.tag+` used the sfx command`);

      isReady = false;
      var voiceChannel = message.member.voice.channel;
      voiceChannel.join().then(connection => {
        console.log(f.t()+`Playing sfx file ${args[0]}.mp3`);
        const dispatcher = connection.play(`./audio/${args[0]}.mp3`);

        connection.on('error', e => console.log(e));
        connection.on('debug', d => console.log(d));
        dispatcher.on("end", end => {
          voiceChannel.leave();
        });
      }).catch(err => console.log(err));
      isReady = true;

    },
};
