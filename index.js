const fs = require('fs');

const Discord = require("discord.js");
const config = require('./config.json')

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const prefix = "p?";

client.on("message", async (message) => {


  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const commandName = args.shift().toLowerCase();

  if (args.indexOf('"console"') != -1) {
    args.pop()
  }
  
  const imagemdobot = message.client.user.displayAvatarURL();

  const argsanterior = commandBody.split(' ');
  const ultimoarg = argsanterior[argsanterior.length - 1]

  const argsJoin = args.join(" ")
  const nickencoded = encodeURI(argsJoin)

  const erro = new Discord.MessageEmbed()
        .setColor('#eb2a00')
        .setDescription('Nick não encontrado ou perfil privado.')

  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

	try {
    command.execute({client, message, args, imagemdobot, argsanterior, ultimoarg, argsJoin, nickencoded, erro});
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}

  
});

client.login(config.BOT_TOKEN);



