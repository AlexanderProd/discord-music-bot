const f = require('../functions.js');

module.exports = {
    name: 'stop',
    description: 'Stopt!',
    execute(message, args) {

      console.log(f.t()+"Stop")
      const { voiceChannel } = message.member;
      voiceChannel.leave();
      var isReady = true;

    },
};
