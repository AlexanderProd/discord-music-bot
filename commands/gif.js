const { tenorApiToken } = require('./../config.json');
const snekfetch = require('snekfetch');
const functions = require('../functions.js');
const tt = functions.ctimestamp();

module.exports = {
    name: 'gif',
    description: 'Du bekommst ein zufälliges gif, kannst aber auch nach einem suchen.',
    usage: '<suche oder leer für zufälliges gif>',
    async execute(message, args) {

      const { body } = await snekfetch.get(`https://api.tenor.com/v1/search?q=${args}&key=${tenorApiToken}&limit=20&anon_id=3a76e56901d740da9e59ffb22b988242`);
      var rndm = Math.floor(Math.random() * 20);
      console.log(tt+"Random number for gif command"+rndm)
      message.channel.send(body.results[rndm].url);
      
    },
};
