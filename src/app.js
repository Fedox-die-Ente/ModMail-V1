
 const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
 const { Intents, Client } = require("discord.js")
 const { token, prefix, colors, modmail, support_roleid, categoryname } = require("../settings.json")
 const fs = require("fs")
 const config = require('../settings.json')
 const translate = require("./tools/translate.js")
 const toml = require('toml')
 const statusconfig = toml.parse(fs.readFileSync('./config.toml', 'utf-8')) 

 const client = new Client({
     intents: [
         Intents.FLAGS.GUILDS,
         Intents.FLAGS.GUILD_MESSAGES,
         Intents.FLAGS.GUILD_MEMBERS,
         Intents.FLAGS.GUILD_MESSAGES,
         Intents.FLAGS.DIRECT_MESSAGES,
     ], partials: ["CHANNEL"]
 })
 
 
 client.log = function (content) {
     console.log(`${new Date().toLocaleString()} : ${content}`)
 }
 
 client.on("ready", async () => {
     const guild = client.guilds.cache.get(modmail.server_id)
 
     if (!guild?.me.permissions.has("ADMINISTRATOR")) {
         client.log(translate("startup.PERMISSION_REQUIRED"))
         return process.kill(process.pid);
     } else if (!modmail.role_ids.length) {
         client.log(translate("startup.MISSING_ROLE_IDS"))
         return process.kill(process.pid);
     } else if (!guild.channels.cache.find(x => x.name === `${categoryname}`)) {
         client.log(translate("startup.SETUP_MESSAGE_1"))
 
         await guild.channels.create(`${categoryname}`, {
             type: "GUILD_CATEGORY",
             position: guild.channels.length + 1,
             permissionOverwrites: modmail.role_ids.map(role => {
                 return { id: role, allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"] }
             }).concat({
                 id: guild.roles.everyone.id,
                 deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
             })
         })
 
         client.log(translate("startup.SETUP_MESSAGE_2"))
     }
 
     client.log(translate("startup.CONNECTED", { name: client.user.username, memberCount: guild.memberCount }))
 })

 /**
  * Rich Presence
  */
  let status = statusconfig.status
  , i = 0;

  setInterval(function(){
    let text = status[parseInt(i, 10)].name.replace('{servercount}', client.guilds.cache.size);

    //set activity
    client.user.setActivity(text, { type: status[parseInt(i, 10)].type });
    if(status[parseInt(i+1, 10)]) i++;
    else i = 0;
  }, 20000)

 /**
  * Event Handler
  */
  const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
  for(let file of eventFiles){
      const event = require('./events/' + file);
      client.on(event.name, (...args) => event.execute(...args));
  }
 
 /**
  * ModMail
  */
 
 client.on("messageCreate", async (message) => {
     if (message.author.bot) return;
     if (!message.guild) {
         const guild = client.guilds.cache.get(modmail.server_id) || await client.guilds.fetch(modmail.server_id).catch(m => { })
         const member = guild?.members.cache.get(message.author.id) || await guild?.members.fetch(message.author.id).catch(err => { })
 
 
         if (!member) return client.log(translate("system.MEMBER_NOT_FOUND", { member: message.author.tag }))
 
         const category = guild.channels.cache.find((x) => x.name == `${categoryname}`)
         if (!category) return client.log(translate("system.PARENT_MISSING"))
         message.react("✅")
         let channel = guild.channels.cache.find((x) => x.name == message.author.id && x.parentId === category.id)
 
         if (!channel) {
             channel = await guild.channels.create(message.author.id, {
                 type: "text",
                 parent: category.id,
                 topic: `ModMail für » ${message.author.tag}`
             })
 
             let success_embed = new MessageEmbed()
                .setAuthor({ name: `${message.author.username}`, iconURL: message.author.avatarURL()})
                .setTitle('Modmail erstellt')
                .setColor("GREEN")
                .setDescription(translate("system.SUCCESS_EMBED.DESCRIPTION"))
                .setFooter({ text: 'Modmail von ' + message.author.tag + ' » ' + message.author.id})
 
             message.author.send({ embeds: [success_embed] })

             const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('mm_answers_greeting')
                            .setLabel('Begrüßen')
                            .setEmoji('👋')
                            .setStyle('PRIMARY'),
                        new MessageButton()
                            .setCustomId('mm_answers_topic')
                            .setLabel('Nach Anliegen fragen')
                            .setEmoji('❓')
                            .setStyle('PRIMARY'),
                        new MessageButton()
                            .setCustomId('mm_answers_one_moment')
                            .setLabel('Ich bin gleich wieder da')
                            .setStyle('SECONDARY')
                            .setEmoji('🕐'),
                        new MessageButton()
                            .setCustomId('mm_answers_look')
                            .setLabel('Ich schaue mir das an')
                            .setStyle('SECONDARY')
                            .setEmoji('👁️'),
                    );
                const row2 = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('mm_answers_more_infos')
                            .setLabel('Nach mehr Infos fragen')
                            .setStyle('SECONDARY')
                            .setEmoji('❓'),
                        new MessageButton()
                            .setCustomId('mm_answers_thats_it')
                            .setLabel('Wir sind fertig')
                            .setStyle('SUCCESS')
                            .setEmoji('🏁'),
                        new MessageButton()
                            .setCustomId('mm_answers_further_questions')
                            .setLabel('Nach weiteren Fragen fragen')
                            .setStyle('SUCCESS')
                            .setEmoji('❓'),
                        new MessageButton()
                            .setCustomId('mm_answers_close')
                            .setLabel('Verabschieden')
                            .setStyle('SUCCESS')
                            .setEmoji('👋'),
                        new MessageButton()
                            .setCustomId('mm_close')
                            .setLabel('Modmail schließen')
                            .setStyle('DANGER')
                            .setEmoji('❌')
                    )
 
             let details_embed = new MessageEmbed()
                .setAuthor({ name:message.author.username, iconURL: message.author.avatarURL()})
                .setTitle('Modmail von ' + message.author.username)
                .setDescription('Nachricht: ' + `**${message.content}**` + '\n\n' +
                    '> Hinweis: Über die Buttons kannst du im Gespräch vorgefertigte Nachrichten senden!\n\n' +
                    '> - **blaue Antworten** passen eher an den **Beginn des Gesprächs**\n' +
                    '> - **graue Antworten** passen eher in die **Mitte des Gesprächs**\n' +
                    '> - **grüne Antworten** passen besser ans **Ende des Gesprächs**\n' +
                    '> - **rote Buttons** sind **keine Antworten**, sondern schließen die Modmail')
                .setColor("#f5d611")
                .setFooter({ text: 'Modmail von ' + message.author.tag + ' » ' + message.author.id})
 
             return channel.send({ embeds: [details_embed], components: [row, row2], content: `<@&${config.modmail.support_roleid}>` })
            } else {
                let content_embed = new MessageEmbed()
                    .setAuthor({ name:message.author.username, iconURL: message.author.avatarURL()})
                    .setTitle('Modmail von ' + message.author.username)
                    .setDescription(message.content)
                    .setColor("#f5d611")
                    .setFooter({ text: 'Modmail Nachricht von ' + message.author.tag + ' » ' + message.author.id})
 
                if (message.attachments.size) content_embed.setImage(message.attachments.map(x => x)[0].proxyURL)
                channel.send({ embeds: [content_embed] })
            }
 
         
 
     } else if (message.channel.parentId) {
         const category = message.guild.channels.cache.find((x) => x.name == `${categoryname}`)
         if (!category) return client.log(translate("system.PARENT_MISSING"))
 
         if (message.channel.parentId === category.id) {
             //
             let channel_name = message.channel.name
             let userId = await client.users.fetch(channel_name);
             let member = message.guild.members.cache.get(userId) || await message.guild.members.fetch(userId).catch(err => { })
             if (!member) return message.channel.send(translate("system.MEMBER_NOT_FOUND", { member: message.author.tag }))
             message.react("✅")
             let content_embed = new MessageEmbed()
                .setAuthor({ name:message.author.username, iconURL: message.author.avatarURL()})
                .setTitle('Modmail von ' + message.author.username)
                .setDescription(message.content)
                .setColor("#f5d611")
                .setFooter({ text: 'Modmail Nachricht von ' + message.author.tag + ' » ' + message.author.id})
 
             if (message.attachments.size) content_embed.setImage(message.attachments.map(x => x)[0].proxyURL)
             return member.send({ embeds: [content_embed] })
         }
     }
 })
 
 
 
 /**
  * ModMail geschlossen
  */
 client.on("channelDelete", async (channel) => {
     const category = channel.guild.channels.cache.find((x) => x.name == `${categoryname}`)
     if (!category) return client.log(translate("system.PARENT_MISSING"))
     let userId = await client.users.fetch(channel.name);
     const member = channel.guild.members.cache.get(channel.name) || await channel.guild.members.fetch(channel.name).catch(err => { })
     if (!member) return client.log(translate("system.MEMBER_NOT_FOUND", { member: "XXX" }))
 
     const embed = new MessageEmbed()
         .setAuthor({ name: `${userId.username}`, iconURL: userId.avatarURL()})
         .setTitle('Modmail geschlossen.')
         .setColor('RED')
         .setDescription(translate("system.DELETE_EMBED.DESCRIPTION"))
         .setFooter({ text: 'Modmail von ' + userId.tag + ' » ' + userId.id})
 
     return member.send({ embeds: [embed] }).catch(err => { })
 })
 
 client.login(token)
 
 