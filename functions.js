const Discord = require('discord.js');
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const youtube = require('./youtube.js');
var ytAudioQueue = [];

module.exports = {
  sleep: function(milliseconds){
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  },

  hello: function(args){
    if(args[0] == "1"){
      return "erste antwort";
    } else if(args[0] == "2") {
      return "zweite antwort";
    } else {
      return "keine antwort";
    }
  },

  PlayCommand: async function(searchTerm, message){
    // if not connected to a voice channel then connect to first one
    if (client.voiceConnections.array().length == 0) {
        this.JoinCommand(message);
    }

    // search youtube using the given search search term and perform callback action if video is found
    await youtube.search(searchTerm, this.QueueYtAudioStream());
  },

  PlayQueueCommand: function(message){
    var queueString = "";

    for(var x = 0; x < ytAudioQueue.length; x++) {
        queueString += ytAudioQueue[x].videoName + ", ";
    }

    queueString = queueString.substring(0, queueString.length - 2);
    message.reply(queueString);
  },

  JoinCommand: function(message) {
    var voiceChannel = message.member.voiceChannel;

    if (voiceChannel) {
        voiceChannel.join();
        console.log("Joined " + voiceChannel.name);
    }

    return voiceChannel;
  },

  QueueYtAudioStream: function(videoId, videoName) {
    var streamUrl = `${youtube.watchVideoUrl}${videoId}`;

    if (!ytAudioQueue.length) {
        ytAudioQueue.push(
            {
                'streamUrl': streamUrl,
                'videoName': videoName
            }
        );

        console.log("Queued audio " + videoName);
        this.PlayStream(ytAudioQueue[0].streamUrl);
    }
    else {
        ytAudioQueue.push(
            {
                'streamUrl': streamUrl,
                'videoName': videoName
            }
        );

        console.log("Queued audio " + videoName);
    }
  },

  PlayStream: function(streamUrl) {
    const streamOptions = {seek: 0, volume: 1};

    if (streamUrl) {
        const stream = ytdl(streamUrl, {filter: 'audioonly'});

        if (dispatcher == null) {

            var voiceConnection = client.voiceConnections.first();
            //console.log(voiceConnection);

            if (voiceConnection) {

                console.log("Now Playing " + ytAudioQueue[0].videoName);
                dispatcher = client.voiceConnections.first().play(stream, streamOptions);

                dispatcher.on('end', () => {
                    this.PlayNextStreamInQueue();
                });

                dispatcher.on('error', (err) => {
                    console.log(err);
                });
            }
        }
        else {
            dispatcher = client.voiceConnections.first().playStream(stream, streamOptions);
        }
    }
  },

  PlayNextStreamInQueue: function() {

    ytAudioQueue.splice(0, 1);

    // if there are streams remaining in the queue then try to play
    if (ytAudioQueue.length != 0) {
        console.log("Now Playing " + ytAudioQueue[0].videoName);
        this.PlayStream(ytAudioQueue[0].streamUrl);
    }
  }

}
