const functions = require('../functions.js'), tt = functions.ctimestamp();

module.exports = {
    name: 'stop',
    description: 'Stopt!',
    execute(message, args) {

      console.log(tt+"Stop")
      const { voiceChannel } = message.member;
      voiceChannel.leave();
      var isReady = true;

    },
};
