const request = require('request');
const functions = require('../functions.js'), tt = functions.ctimestamp();

module.exports = {
    name: 'instant',
    description: 'Sucht nach einem Sound auf myinstants.com und spielt ihn ab!',
    async execute(message, args) {
      console.log(tt+"Running instant command.")

      var search = encodeURI(args.join(" "));
      var filename, results, rndm;

      console.log(tt+"Searched: " + search);

      await request('https://api.cleanvoice.ru/myinstants/?type=many&search=' + search + '&offset=0&limit=500', { json: true }, (err, res, body) => {
        if (err) {
          return console.log(err);
        }
        results = body.count;
        console.log(tt+"Results: " + results);

        if (results != '0') {
          results = Math.min(Math.max(parseInt(results), 0), 500);
          rndm = Math.floor(Math.random() * results);
          console.log(tt+"RND: "+rndm);

          console.log(tt+"Playing: " + body.items[rndm].filename);
          filename = body.items[rndm].filename;
          title = body.items[rndm].title;
          console.log(tt+"Title: " + body.items[rndm].title);

          message.channel.send('https://www.myinstants.com/instant/' + title.replace(/[^a-zA-Z| ]/g, "").replace(/ /g,'-') +'/');

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
        }

        else {
          return message.reply('Nichts gefunden!');
        }
      });

    },
};
