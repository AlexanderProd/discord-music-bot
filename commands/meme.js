const request = require('request');
const f = require('../functions.js');

module.exports = {
  name: 'meme',
  description:
    "I'm gonna show you a dank meme. You can also select a language, available are de, en, es, it, ru, fr.",
  usage: '<empty or one of en, de, ru, it, fr>',
  async execute(message, args) {
    console.log(f.t() + message.author.tag + ` used the ${this.name} command`);

    const lang =
      args[0] === ('de' || 'en' || 'fr' || 'ru' || 'es' || 'it')
        ? `?lang=${args[0]}`
        : '?lang=en';

    request(
      `https://memes.blademaker.tv/api${lang}`,
      { json: true },
      (err, res, body) => {
        if (err) {
          return console.log(err);
        }

        const { image, title } = body;

        message.channel.send(`**${title}**\n${image}`);
      }
    );
  },
};
