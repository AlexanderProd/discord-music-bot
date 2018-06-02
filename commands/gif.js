const { tenorApiToken } = require('./../config.json');
const snekfetch = require('snekfetch');

module.exports = {
    name: 'gif',
    description: 'Posts a gif to the channel.',
    async execute(message, args) {

      const { body } = await snekfetch.get(`https://api.tenor.com/v1/search?q=${args}&key=${tenorApiToken}&limit=20&anon_id=3a76e56901d740da9e59ffb22b988242`);
      var rndm = Math.floor(Math.random() * 20);
      message.channel.send(body.results[rndm].url);

    },
};
