const snekfetch = require('snekfetch');

module.exports = {
    name: 'cat',
    description: 'Macht was es soll.',
    async execute(message, args) {

      const { body } = await snekfetch.get('https://aws.random.cat/meow');
      message.channel.send(body.file);

    },
};
