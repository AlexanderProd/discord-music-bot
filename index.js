const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const { prefix, token } = require('./config.json');
const YouTube = require("discord-youtube-api");

const youtube = new YouTube("AIzaSyCmNuBuf7eHIeBXj5wEkjiZNNQ503mo0U8");
const client = new Discord.Client();

const snekfetch = require('snekfetch');
const request = require('request');

var isReady = true;

client.on('ready', () => {
    client.user.setActivity('boi', { type: 'LISTENING' });
});

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'cx') {
      if (message.channel.type !== 'text') return;

      const { voiceChannel } = message.member;

      if (!voiceChannel) {
          return message.reply('please join a voice channel first!');
      }

      voiceChannel.join().then(connection => {
          const stream = ytdl('https://www.youtube.com/watch?v=2g30Xu_IV7Y', { filter: 'audioonly' });
          const dispatcher = connection.playStream(stream);

          dispatcher.on('end', () => voiceChannel.leave());
      });
    }

    else if (command === 'stop') {
      const { voiceChannel } = message.member;
      voiceChannel.leave();
      var isReady = true;
    }

    else if (command === 'spiel'){
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
    }

    else if (command === 'args-info') {
      if (!args.length) {
          return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
      }
      message.channel.send(`Command name: ${command}\nArguments: ${args}`);
    }

    else if (command === 'sfx') {
      isReady = false;
      var voiceChannel = message.member.voiceChannel;
      voiceChannel.join().then(connection => {
        console.log(`Playing file ${args[0]}.mp3`);
        const dispatcher = connection.playFile(`./audio/${args[0]}.mp3`);

        dispatcher.on('error', e => console.log(e));
        dispatcher.on('debug', d => console.log(d));
        dispatcher.on("end", end => {
          voiceChannel.leave();
        });
      }).catch(err => console.log(err));
      isReady = true;
    }

    else if (command === 'such') {
      isReady = false;
      var video = await youtube.searchVideos(args.toString().replace(/,/g,' '));
      console.log(video.url);
      message.channel.send("Ich spiele " + video.url);

      if (message.channel.type !== 'text') return;

      const { voiceChannel } = message.member;

      if (!voiceChannel) {
        return message.reply('Geh in einen Voice Channel!');
      }

      voiceChannel.join().then(connection => {
        const stream = ytdl(String(video.url), { filter: 'audioonly' });
        const dispatcher = connection.playStream(stream);

        dispatcher.on('end', () => voiceChannel.leave());
        isReady = true;
      });
    }

    else if (command === 'cat') {
      const { body } = await snekfetch.get('https://aws.random.cat/meow');
      message.channel.send(body.file);
    }

    else if (command === 'myinstant') {
      isReady = false;
      var search = encodeURI(args.toString().replace(/,/g,' '));
      var filename, results;

      console.log("Searched: " + search);

      await request('https://api.cleanvoice.ru/myinstants/?type=many&search=' + search + '&offset=0&limit=100', { json: true }, (err, res, body) => {
        if (err) {
          return console.log(err);
        }
        results = body.count;

        if (results != '0') {
          results = Math.min(Math.max(parseInt(results), 0), 100);
          rndm = Math.floor(Math.random() * results);
          console.log("RND: "+rndm);

          console.log("Playing: " + body.items[rndm].filename);
          filename = body.items[rndm].filename;
          title = body.items[rndm].title;

          message.channel.send('https://www.myinstants.com/instant/' + title.replace(/'/g,'').replace(/!/g,'').replace(/ /g,'-') +'/');

          var voiceChannel = message.member.voiceChannel;
          if (!voiceChannel) {
            return message.reply('Geh in einen Voice Channel!');
          }
          voiceChannel.join().then(connection => {
            const dispatcher = connection.playArbitraryInput("https://www.myinstants.com/media/sounds/"+filename);
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

      isReady = true;
    }

});

async function searchYouTubeAsync(args) {
  var video = await youtube.searchVideos(args.toString().replace(/,/g,' '));
  console.log(video.url);
  console.log(typeof String(video.url));
  return String(video.url);
}

function searchYouTube(args) {
  var video = youtube.searchVideos(args.toString().replace(/,/g,' '));
  console.log(video.url);
  console.log(typeof String(video.url));
  return String(video.url);
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

client.login(token);
