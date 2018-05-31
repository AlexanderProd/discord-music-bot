module.exports = {
    name: 'sfx',
    description: 'Spielt einen Soundeffekt ab z.b. boi sfx horns.',
    execute(message, args) {

      isReady = false;
      var voiceChannel = message.member.voiceChannel;
      voiceChannel.join().then(connection => {
        console.log(`Playing file ${args[0]}.mp3`);
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
