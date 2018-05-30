module.exports = {
    name: 'stop',
    description: 'Stopt!',
    execute(message, args) {

      const { voiceChannel } = message.member;
      voiceChannel.leave();
      var isReady = true;

    },
};
