const Discord = require("discord.js")

const requests = require('../apipaladins/requests')

module.exports = {
    name: 'ultima',
    aliases: 'last',
    async execute({message, args, argsJoin, nickencoded, erro}) {

        if (args == 0) {
            const erroultima = new Discord.MessageEmbed()
                .setColor('#A67B77')
                .setDescription('Por favor, especifique um player para ser buscado.  ```Ex: p?ultima percurrido ```')

            return message.channel.send(erroultima);
        }
            try {
            const datasession = await requests.sessionIID()

            let sessionID = datasession.data.session_id;
            
            const datasearch = await requests.requests("searchplayers", nickencoded, sessionID)

            if (datasearch.data == 0 || datasearch.data[0].Name.toLowerCase() != argsJoin.toLowerCase()) {
                console.log('Erro searchplayer')

                return message.channel.send(erro);
            }

            const playerid = datasearch.data[0].player_id;

            const dataget = await requests.requests("getplayer", playerid, sessionID)

            if (dataget.data[0].Id == 0) {

                console.log('Erro getplayer')
                return message.channel.send(erro);

            }

            const avatar = dataget.data[0].AvatarURL || 'https://pbs.twimg.com/profile_images/1153773155816804354/ptQRsA7s_400x400.jpg'

            const datamatch = await requests.requests("getmatchhistory", playerid, sessionID)

            if(datamatch.data[0].Match == 0) {
                const erromatch = new Discord.MessageEmbed()

                .setColor('#eb2a00')
                .setDescription('Partida não encontrada.');
        
              return message.channel.send(erromatch);
            }

            const objmatch = {
                champion: datamatch.data[0].Champion,
                playername: datamatch.data[0].playername,
                queue: datamatch.data[0].Queue,
                winstatus: datamatch.data[0].Win_Status,
                streak: datamatch.data[0].Killing_Spree,
                credits: datamatch.data[0].Gold,
                map: datamatch.data[0].Map_Game,
                time: datamatch.data[0].Minutes,
                region: datamatch.data[0].Region,
                horario: datamatch.data[0].Match_Time,
                kills: datamatch.data[0].Kills,
                deaths: datamatch.data[0].Deaths,
                assists: datamatch.data[0].Assists,
                dmg: datamatch.data[0].Damage,
                dmgtaken: datamatch.data[0].Damage_Taken,
                cura: datamatch.data[0].Healing,
                escudo: datamatch.data[0].Damage_Mitigated,
                matchid: datamatch.data[0].Match
            }
            // KDA
            let kda = ((objmatch.assists + objmatch.kills) / objmatch.deaths).toFixed(2)

            if(kda == Infinity) {
                kda = "0";
            }

            //Win Loss
            const VitoriaDerrota = {
                'Win': 'Vitória',
                'Loss': 'Derrota'
            }

            //Modos
            const Modos = {
                'Siege': 'Cerco', 
                'Onslaught': 'Chacina', 
                'Team Deathmatch': 'Mata-Mata', 
                'Ranked': 'Competitivo'
            } 


            //Data e horário
            const data = new Date(objmatch.horario);
            data.setHours(data.getHours() - 3)

            //Mapas
            const mapaarray = objmatch.map.split(' ').filter(x => x != 'LIVE' && x != 'Ranked');
             
            const embedultima = new Discord.MessageEmbed()
                .setColor('#A67B77')
                .setAuthor(`Última partida de ${dataget.data[0].hz_player_name || dataget.data[0].Name}`, avatar)
                .setDescription(`Data: ${data.toLocaleString('pt-br')}\n Duração: ${objmatch.time} minutos\n Região: ${objmatch.region}`)
                .addField('Resultado', VitoriaDerrota[objmatch.winstatus], true)
                .addField('Modo de Jogo', Modos[objmatch.queue] || objmatch.queue, true)
                .addField('Mapa', mapaarray.join(' '), true)
                .addField('Campeão', objmatch.champion, true)
                .addField('Créditos', objmatch.credits, true)
                .addField('Streak Max', objmatch.streak, true)
                .addField('Dano', objmatch.dmg, true)
                .addField('Dano Recebido', objmatch.dmgtaken, true)
                .addField('Cura', objmatch.cura, true)
                .addField('Escudo', objmatch.escudo, true)
                .addField('Kills/Deaths/Assists', `${objmatch.kills}/${objmatch.deaths}/${objmatch.assists}`, true)
                .addField('KDA', kda, true)
                .setFooter(`ID da Partida: ${objmatch.matchid}`)

            return message.channel.send(embedultima)

            } catch {
                message.channel.send(erro)
            }
        
    }

}
