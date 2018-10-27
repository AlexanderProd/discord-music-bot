const { prefix } = require('./../config.json');

module.exports = {
    name: 'hilfe',
    description: 'Ich höre auf folgende Befehle.',
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 5,
    execute(message, args) {
      console.log(f.t()+message.author.tag+` used the hilfe command`);

      const { commands } = message.client;
      const data = [];

      if (!args.length) {
        data.push('Hier sind alle meine Befehle');
        data.push(commands.map(command => command.name).join(', '));
        data.push(`\nDu kannst \`${prefix}hilfe <Befehl Name>\` verwenden um mehr über einen Befehl zu erfahren!`);
      }
      else {
        if (!commands.has(args[0])) {
            return message.reply('Das ist kein gültiger Befehl');
        }

        const command = commands.get(args[0]);

        data.push(`**Name:** ${command.name}`);

        if (command.description) data.push(`**Beschreibung:** ${command.description}`);
        if (command.aliases) data.push(`**Alternativen:** ${command.aliases.join(', ')}`);
        if (command.usage) data.push(`**Verwendung:** ${prefix}${command.name} ${command.usage}`);

        //data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
      }

      message.channel.send(data, { split: true });

    },
};
