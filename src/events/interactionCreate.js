const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        if(!interaction.isButton()) return;

        const client = interaction.client;

        let userId = interaction.channel.name;
        let user = await client.users.fetch(userId);

        if(!user) return;

        if(interaction.customId === 'mm_answers_greeting'){
            let text = `> Ich bin ${interaction.member.user.username} und stehe dir gerne bei deinen Fragen zur Verfügung!\n> Wie kann ich dir helfen?`;
            let embed = new MessageEmbed()
                //.setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
                .setAuthor({ name:interaction.member.user.username, iconURL: interaction.member.user.avatarURL()})
                .setTitle('Willkommen im Support, ' + user.username)
                .setColor('#f5d611')
                .setDescription(text)
                .setFooter({ text: 'Modmail von ' + user.tag + ' » ' + user.id })
            let answer = await interaction.reply({content: text, fetchReply: true});
            user.send({embeds:[embed]})
                .then(async () => {
                    await answer.react("✅");
                })
                .catch(async (error) => {
                    await answer.react("❌");
                })
        }
        if(interaction.customId === 'mm_answers_topic'){
            let text = `> Kannst du mir bitte dein Anliegen beschreiben? Gerne mit Bildern, Videos etc.\n\n *Tipp: Beschreibe dein Anliegen so detailliert wie möglich!*`;
            let embed = new MessageEmbed()
                //.setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
                .setAuthor({ name:interaction.member.user.username, iconURL: interaction.member.user.avatarURL()})
                .setTitle('Was ist dein Anliegen, ' + user.username +'?')
                .setColor('#f5d611')
                .setDescription(text)
                .setFooter({ text: 'Modmail von ' + user.tag + ' » ' + user.id })
            let answer = await interaction.reply({content: text, fetchReply: true});
            user.send({embeds:[embed]})
                .then(async () => {
                    await answer.react("✅");
                })
                .catch(async (error) => {
                    await answer.react("❌");
                })
        }
        if(interaction.customId === 'mm_answers_one_moment'){
            let text = `> Ich bin kurz weg, einen Moment bitte`;
            let embed = new MessageEmbed()
                .setAuthor({ name:interaction.member.user.username, iconURL: interaction.member.user.avatarURL()})
                .setTitle('Ich bin gleich wieder da, ' + user.username)
                .setColor('#f5d611')
                .setDescription(text)
                .setFooter({ text: 'Modmail von ' + user.tag + ' » ' + user.id })
            let answer = await interaction.reply({content: text, fetchReply: true});
            user.send({embeds:[embed]})
                .then(async () => {
                    await answer.react("✅");
                })
                .catch(async (error) => {
                    await answer.react("❌");
                })
        }
        if(interaction.customId === 'mm_answers_look'){
            let text = `> Ich gucke mir das eben an, und melde mich gleich wieder bei dir`;
            let embed = new MessageEmbed()
                //.setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
                .setAuthor({ name:interaction.member.user.username, iconURL: interaction.member.user.avatarURL()})
                .setTitle('Ich schaue mir das kurz an, ' + user.username)
                .setColor('#f5d611')
                .setDescription(text)
                .setFooter({ text: 'Modmail von ' + user.tag + ' » ' + user.id })
            let answer = await interaction.reply({content: text, fetchReply: true});
            user.send({embeds:[embed]})
                .then(async () => {
                    await answer.react("✅");
                })
                .catch(async (error) => {
                    await answer.react("❌");
                })
        }
        if(interaction.customId === 'mm_answers_more_infos'){
            let text = `> Um dir optimal helfen zu können, brauche ich mehr Informationen - dazu zählen Bilder, Videos etc.\n\n*Tipp: Beschreibe dein Anliegen so detailliert wie möglich*`;
            let embed = new MessageEmbed()
                //.setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
                .setAuthor({ name:interaction.member.user.username, iconURL: interaction.member.user.avatarURL()})
                .setTitle('Ich brauche mehr Infos, ' + user.username )
                .setColor('#f5d611')
                .setDescription(text)
                .setFooter({ text: 'Modmail von ' + user.tag + ' » ' + user.id })
            let answer = await interaction.reply({content: text, fetchReply: true});
            user.send({embeds:[embed]})
                .then(async () => {
                    await answer.react("✅");
                })
                .catch(async (error) => {
                    await answer.react("❌");
                })
        }
        if(interaction.customId === 'mm_answers_thats_it'){
            let text = `> Das war auch schon alles, danke für deine Kontaktaufnahme!`;
            let embed = new MessageEmbed()
               // .setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
                .setAuthor({ name:interaction.member.user.username, iconURL: interaction.member.user.avatarURL()})
                .setTitle('Wir sind fertig, ' + user.username)
                .setColor('#f5d611')
                .setDescription(text)
                .setFooter({ text: 'Modmail von ' + user.tag + ' » ' + user.id })
            let answer = await interaction.reply({content: text, fetchReply: true});
            user.send({embeds:[embed]})
                .then(async () => {
                    await answer.react("✅");
                })
                .catch(async (error) => {
                    await answer.react("❌");
                })
        }
        if(interaction.customId === 'mm_answers_further_questions'){
            let text = `> Wenn du weitere Fragen hast, zögere nicht sie mir jetzt zu schreiben!`;
            let embed = new MessageEmbed()
                //.setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
                .setAuthor({ name:interaction.member.user.username, iconURL: interaction.member.user.avatarURL()})
                .setTitle('Hast du weitere Fragen, ' + user.username + '?')
                .setColor('#f5d611')
                .setDescription(text)
                .setFooter({ text: 'Modmail von ' + user.tag + ' » ' + user.id })

            let answer = await interaction.reply({content: text, fetchReply: true});
            user.send({embeds:[embed]})
                .then(async () => {
                    await answer.react("✅");
                })
                .catch(async (error) => {
                    await answer.react("❌");
                })
        }
        if(interaction.customId === 'mm_answers_close'){
            let date = new Date();
            let text = `> Ich wünsche dir einen schönen restlichen ${date.toLocaleDateString('de-DE', { weekday: 'long' })}\n> Sollten sich neue Fragen ergeben, zögere nicht mich anzuschreiben!`;
            let embed = new MessageEmbed()
                //.setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
                .setAuthor({ name:interaction.member.user.username, iconURL: interaction.member.user.avatarURL()})
                .setTitle('Schönen Tag noch, ' + user.username)
                .setColor('#f5d611')
                .setDescription(text)
                .setFooter({ text: 'Modmail von ' + user.tag + ' » ' + user.id })
            let answer = await interaction.reply({content: text, fetchReply: true});
            user.send({embeds:[embed]})
                .then(async () => {
                    await answer.react("✅");
                })
                .catch(async (error) => {
                    await answer.react("❌");
                })
        }
        if(interaction.customId === 'mm_close'){
            interaction.channel.delete();
        }
    }
}