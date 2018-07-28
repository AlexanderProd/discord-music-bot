const snekfetch = require('snekfetch');
const functions = require('../functions.js'), tt = functions.ctimestamp();

module.exports = {
    name: 'cat',
    description: 'Macht was es soll.',
    async execute(message, args) {

      console.log(tt+"Running cat command.");
      const { body } = await snekfetch.get('https://aws.random.cat/meow');
      message.channel.send(body.file);

    },
};
