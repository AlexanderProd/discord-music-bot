const request = require('request');
const f = require('../functions.js');

module.exports = {
    name: 'random',
    description: 'Spielt einen zufälligen Sound auf myinstants.com ab.',
    async execute(message, args) {
      console.log(f.t()+message.author.tag+` used the random command`);

      var filename, results;

      await request('https://api.cleanvoice.ru/myinstants/?type=single', { json: true }, (err, res, body) => {
        if (err) {
          return console.log(err);
        }

        filename = body.filename;
        title = body.title;
        console.log(f.t()+"Playing: " + filename + " with title " + title);

        /*Trying to create the myinstant.com url for this sound and sending it to the channel */
        message.channel.send('https://www.myinstants.com/instant/' + title.replace(/'/g,'').replace(/!/g,'').replace(/ /g,'-') +'/');

        var voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
          return message.reply('Geh in einen Voice Channel!');
        }
        voiceChannel.join().then(connection => {
          const dispatcher = connection.play("https://www.myinstants.com/media/sounds/"+filename);
          dispatcher.setVolume(1);
          dispatcher.on("end", end => {
            voiceChannel.leave();
          });
        }).catch(err => console.log(err));
      });

    },
};
