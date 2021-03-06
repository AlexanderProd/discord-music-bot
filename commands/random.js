const request = require('request');
const f = require('../functions.js');

module.exports = {
  name: 'random',
  description: 'Plays a random sound from myinstants.com',
  async execute(message, args) {
    console.log(f.t() + message.author.tag + ' used the random command');

    let filename, results;

    request(
      'https://api.cleanvoice.ru/myinstants/?type=single',
      { json: true },
      (err, res, body) => {
        if (err) {
          return console.log(err);
        }

        filename = body.filename;
        title = body.title;
        console.log(f.t() + 'Playing: ' + filename + ' with title ' + title);

        /*Trying to create the myinstant.com url for this sound and sending it to the channel */
        message.channel.send(
          'https://www.myinstants.com/instant/' +
            title.replace(/'/g, '').replace(/!/g, '').replace(/ /g, '-') +
            '/'
        );

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
          return message.reply('Get in a voice channel!');
        }
        voiceChannel
          .join()
          .then(connection => {
            const dispatcher = connection.play(
              'https://www.myinstants.com/media/sounds/' + filename
            );
            dispatcher.setVolume(1);
            dispatcher.on('end', () => {
              console.log('test');
              voiceChannel.leave();
            });
          })
          .catch(err => console.log(err));
      }
    );
  },
};
