const Discord = require("discord.js")

const elos = require('../apipaladins/tiers')
const requests = require('../apipaladins/requests')

module.exports = {
  name: 'split',
  async execute({client, message, args, ultimoarg, erro, argsJoin, nickencoded}) {

    if (args == 0) {

      const split = new Discord.MessageEmbed()

        .setColor('#eb2a00')
        .setDescription('Por favor, especifique um player para ser buscado.  ```Ex: p?split percurrido ``` ``(Se o player for de console, adicione "console" após o nick do jogador. Ou também, serve para jogadores do pc que quiserem ver seus status do console.)``');

      return message.channel.send(split);

    }


      try {
      const data2 = await requests.sessionIID()

      let sessionID = data2.data.session_id;

      const data1 = await requests.requests("searchplayers", nickencoded, sessionID)
    
      if (data1.data == 0 || data1.data[0].Name.toLowerCase() != argsJoin.toLowerCase()) {
        console.log('Erro searchplayer')

        return message.channel.send(erro);
      }

      const playerid = data1.data[0].player_id;

      const data = await requests.requests("getplayer", playerid, sessionID)

      if (data.data[0].Id == 0) {

        console.log('Erro getplayer')
        return message.channel.send(erro);

      }

      const escolherplataform = (plataforma) => {

        const ComandosSplit = [{
          //Comandos Do PC
          pontos: data.data[0].RankedKBM.Points,
          rank: data.data[0].RankedKBM.Tier,
          wins: data.data[0].RankedKBM.Wins,
          loss: data.data[0].RankedKBM.Losses,
          posi: data.data[0].RankedKBM.Rank,
        },
        {
          //Comandos do console
          pontos: data.data[0].RankedController.Points,
          rank: data.data[0].RankedController.Tier,
          wins: data.data[0].RankedController.Wins,
          loss: data.data[0].RankedController.Losses,
          posi: data.data[0].RankedController.Rank,
        }];

        const plataformas = {
          '"console"': 1 // Índice do array comandos 
        }

        return ComandosSplit[plataformas[plataforma]] || ComandosSplit[0]
      }

      let taxa = +(escolherplataform(ultimoarg).wins / (escolherplataform(ultimoarg).wins + escolherplataform(ultimoarg).loss) * 100).toFixed(1) || '0';

      if (escolherplataform(ultimoarg).posi <= 100 && escolherplataform(ultimoarg).posi > 0) {
        elos.Tiers[26] = [`Grão-Mestre (Rank. ${escolherplataform(ultimoarg).posi})`, 'https://i.imgur.com/SyAyPHF.png'];
      } else {
        elos.Tiers[26] = [`Mestre (Rank. ${escolherplataform(ultimoarg).posi})`, 'https://i.imgur.com/p5kLZ8p.png'];
      };

      const percury = await client.users.fetch("331479619670638592")

      const newsplit = new Discord.MessageEmbed()
        .setColor('#A67B77')
        .setAuthor(data.data[0].hz_player_name || data.data[0].Name, data.data[0].AvatarURL || 'https://pbs.twimg.com/profile_images/1153773155816804354/ptQRsA7s_400x400.jpg')
        .addField('Vitórias/Derrotas', `${escolherplataform(ultimoarg).wins}/${escolherplataform(ultimoarg).loss}`, true)
        .addField('Taxa de Vitória', `${taxa}%`, true)
        .addField('Elo:', `${elos.Tiers[escolherplataform(ultimoarg).rank][0]}`, true)
        .setThumbnail(elos.Tiers[escolherplataform(ultimoarg).rank][1])
        .addField('Pontos:', `${escolherplataform(ultimoarg).pontos}`)
        .setFooter(`Desenvolvedor: ${percury.username}#${percury.discriminator}`, percury.displayAvatarURL());

      return message.channel.send(newsplit);
    } catch {
      message.channel.send(erro);
    }
  }
}
