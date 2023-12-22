const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

const commandDescription = require('../../commands.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription(`Permet de voir la liste des commandes.`),
    async execute(interaction) {
        const res = new EmbedBuilder()
            .setColor('Blurple')
            .setTitle('Liste des commandes')
            .addFields(
                {
                    name: '\u200b',
                    value: '🛠️** Administration**'
                },
                {
                    name: '\u200a',
                    value: '\u200a'
                },
                {
                    name: '</disable-economy:1187736150245392454>',
                    value: commandDescription['disable-economy']
                },
                {
                    name: '</enable-economy:1187736150245392455>',
                    value: commandDescription['enable-economy']
                },
                {
                    name: '</disable-welcome:1187086697427644476>',
                    value: commandDescription['disable-welcome']
                },
                {
                    name: '</setup-welcome:1187086697427644477>',
                    value: commandDescription['setup-welcome']
                },
                {
                    name: '\u200a',
                    value: '\u200a'
                },
                {
                    name: '\u200b',
                    value: '🛡️** Modération**'
                },
                {
                    name: '\u200a',
                    value: '\u200a'
                },
                {
                    name: '</clear:1184765584345419798>',
                    value: commandDescription['clear']
                },
                {
                    name: '\u200a',
                    value: '\u200a'
                },
                {
                    name: '\u200b',
                    value: '💸** Economie**'
                },
                {
                    name: '\u200a',
                    value: '\u200a'
                },
                {
                    name: '</nouveau-compte:1186231398156222566>',
                    value: commandDescription['nouveau-compte']
                },
                {
                    name: '</compte:1186231398156222565>',
                    value: commandDescription['compte']
                },
                {
                    name: '</pole-emploi:1187473930236211339>',
                    value: commandDescription['pole-emploi']
                },
                {
                    name: '</work:1187466944031494155>',
                    value: commandDescription['work']
                },
                {
                    name: '\u200a',
                    value: '\u200a'
                },
                {
                    name: '\u200b',
                    value: '❓** Informations**'
                },
                {
                    name: '\u200a',
                    value: '\u200a'
                },
                {
                    name: '</support:1186652337750671401>',
                    value: commandDescription['support']
                },
                {
                    name: '\u200a',
                    value: '\u200a'
                },
                {
                    name: '\u200b',
                    value: '🎮** Divertissement**'
                },
                {
                    name: '\u200a',
                    value: '\u200a'
                },
                {
                    name: '</8ball:1184765584345419797>',
                    value: commandDescription['8ball']
                },
                {
                    name: '\u200a',
                    value: '\u200a'
                },
                {
                    name: '\u200b',
                    value: ':scroll:** Général'
                },
                {
                    name: '\u200a',
                    value: '\u200a'
                },
                {
                    name: '</help:',
                    value: commandDescription['help']
                },
                {
                    name: '</ping:1184765584345419799>',
                    value: commandDescription['ping']
                },
                {
                    name: '\u200a',
                    value: '\u200a'
                },
                {
                    name: '\u200b',
                    value: '⚡** Sentinel Premium**'
                },
                {
                    name: '\u200a',
                    value: '\u200a'
                },
                {
                    name: '</claim-premium:1187035181551452200>',
                    value: commandDescription['claim-premium']
                }
            )
            .setTimestamp()

            return interaction.reply({
                embeds: [res]
            })
    }
}