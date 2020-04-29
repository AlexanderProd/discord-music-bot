const { prefix } = require('../config.json');
const f = require('../functions.js');

module.exports = {
  name: 'help',
  description: "I'm listening to the following commands:",
  aliases: ['commands'],
  usage: '[command name]',
  cooldown: 5,
  execute(message, args) {
    console.log(f.t() + message.author.tag + ` used the hilfe command`);

    const { commands } = message.client;
    const data = [];

    if (!args.length) {
      data.push('Those are all the commands I know');
      data.push(commands.map(command => command.name).join(', '));
      data.push(
        `\nYou can use \`${prefix}help <Command Name>\` to learn more about a command.`
      );
    } else {
      if (!commands.has(args[0])) {
        return message.reply("I don't know this command.");
      }

      const command = commands.get(args[0]);

      data.push(`**Name:** ${command.name}`);

      if (command.description)
        data.push(`**Description:** ${command.description}`);
      if (command.aliases)
        data.push(`**Alternatives:** ${command.aliases.join(', ')}`);
      if (command.usage)
        data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

      //data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
    }

    message.channel.send(data, { split: true });
  },
};
