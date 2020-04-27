const f = require('../functions.js');

module.exports = {
    name: 'stop',
    description: 'Stopt!',
    execute(message, args) {

      console.log(f.t()+message.author.tag+` used the stop command`);
      const { channel } = message.member.voice;
      channel.leave();
      var isReady = true;

    },
};
