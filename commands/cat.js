const snekfetch = require('snekfetch');
const f = require('../functions.js');

module.exports = {
    name: 'cat',
    description: 'Macht was es soll.',
    async execute(message, args) {
      console.log(f.t()+message.author.tag+" used the cat command")

      console.log(f.t()+"Running cat command.");
      const { body } = await snekfetch.get('https://aws.random.cat/meow');
      message.channel.send(body.file);

    },
};
