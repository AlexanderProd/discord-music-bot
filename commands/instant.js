const request = require('request');
const f = require('../functions.js');

module.exports = {
    name: 'instant',
    description: 'Sucht nach einem Sound auf myinstants.com und spielt ihn ab!',
    async execute(message, args) {
      console.log(f.t()+message.author.tag+` used the instant command`);

      var search = encodeURI(args.join(" "));
      var filename, results, rndm;

      console.log(f.t()+"Searched: " + search);

      await request('https://api.cleanvoice.ru/myinstants/?type=many&search=' + search + '&offset=0&limit=500', { json: true }, (err, res, body) => {
        if (err) {
          return console.log(err);
        }
        results = body.count;
        console.log(f.t()+"Results: " + results);

        if (results != '0') {
          results = Math.min(Math.max(parseInt(results), 0), 500);
          rndm = Math.floor(Math.random() * results);
          console.log(f.t()+"RND: "+rndm);

          console.log(f.t()+"Playing: " + body.items[rndm].filename);
          filename = body.items[rndm].filename;
          title = body.items[rndm].title;
          console.log(f.t()+"Title: " + body.items[rndm].title);

          message.channel.send('https://www.myinstants.com/instant/' + title.replace(/[^a-zA-Z| ]/g, "").replace(/ /g,'-') +'/');

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
        }

        else {
          return message.reply('Nichts gefunden!');
        }
      });

    },
};
