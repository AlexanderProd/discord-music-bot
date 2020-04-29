const request = require('request');
const f = require('../functions.js');

module.exports = {
  name: 'fact',
  description: 'You wont believe those useless facts.',
  async execute(message) {
    console.log(f.t() + message.author.tag + ` used the ${this.name} command`);

    request(
      `https://useless-facts.sameerkumar.website/api`,
      { json: true },
      (err, res, body) => {
        if (err) {
          return console.log(err);
        }

        const { data } = body;

        message.channel.send(data);
      }
    );
  },
};
