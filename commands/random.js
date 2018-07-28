const request = require('request');
const functions = require('../functions.js'), tt = functions.ctimestamp();

module.exports = {
    name: 'random',
    description: 'Spielt einen zufälligen Sound auf myinstants.com ab.',
    async execute(message, args) {
      console.log(tt+"Running random command.")

      var filename, results;

      await request('https://api.cleanvoice.ru/myinstants/?type=single', { json: true }, (err, res, body) => {
        if (err) {
          return console.log(err);
        }

        filename = body.filename;
        title = body.title;
        console.log(tt+"Playing: " + filename + "with title " + title);

        /*Trying to create the myinstant.com url for this sound and sending it to the channel */
        message.channel.send('https://www.myinstants.com/instant/' + title.replace(/'/g,'').replace(/!/g,'').replace(/ /g,'-') +'/');

        var voiceChannel = message.member.voiceChannel;
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
