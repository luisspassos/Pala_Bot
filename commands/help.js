const Discord = require("discord.js")

module.exports = {
	name: 'help',
	description: 'ajuda',
	aliases: ['comandos', 'ajuda'],
	execute({message, imagemdobot}) {
	const embedcomandos = new Discord.MessageEmbed()
      .setColor('#A67B77')
      .setAuthor('PalaBot Comandos', `${imagemdobot}`, '')
      .setDescription('Todos os comandos estão aqui.')
      .addField('**Prefixo:**', '`p?`', true)
      .addField('**Versão:**', '`v1.0.0`', true)
      .addField('**Desenvolvedor:**', '`percury#3494`', true)
      .addField('***Comandos Paladins***', '```CSS\np?split [Player] (Informações do split atual do jogador)``` ```CSS\np?ultima [Player] (Informações da última partida do jogador)```')


    return message.channel.send(embedcomandos);
	},
};