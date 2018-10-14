const fs = require('fs');
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const { prefix, token, youtubeApiToken } = require('./config.json');

const YouTube = require("discord-youtube-api");
const snekfetch = require('snekfetch');
const request = require('request');

const youtube = new YouTube(youtubeApiToken);
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const fct = require('./functions.js');


for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}


client.on('ready', () => {
  client.user.setActivity(prefix + 'hilfe', { type: 'LISTENING' });
  console.log(fct.t()+'Ready!');
});

client.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('Ich habe deinen Befehl nicht verstanden.');
	}
});

client.login(token);
