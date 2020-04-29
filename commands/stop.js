const f = require('../functions.js');

module.exports = {
  name: 'stop',
  description: 'Stops!',
  execute(message, args) {
    console.log(f.t() + message.author.tag + ` used the stop command`);
    const { channel } = message.member.voice;
    channel.leave();
    let isReady = true;
  },
};
