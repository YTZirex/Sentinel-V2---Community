const { 
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

const EconomySchema = require('../../Models/Economy');
const BlacklistSchema = require('../../Models/Blacklist');
const JobSchema = require('../../Models/Job');
const CodeSchema = require('../../Models/CodeSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription(`Permet de voir les informations d'un utilisateur.`)
        .setDMPermission(false)
        .addUserOption((option) =>
            option
                .setName('utilisateur')
                .setDescription(`L'utilisateur à regarder.`)
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.user.options.getUser('utilisateur') || interaction.user;

        const userEconomy = await EconomySchema.findOne({ user: target.id });
        const userBlacklist = await BlacklistSchema.findOne({ user: target.id });
        const userJob = await JobSchema.findOne({ user: target.id });
        const userPremium = await CodeSchema.findOne({ "redeemedBy.id": target.id });

        let isUserPremium;
        let isUserBlacklisted;
        let isUserJob;
        let isUserEconomy;

        if (userPremium) {
            isUserPremium = '✅'
        } else {
            isUserPremium = '❌'
        }

        if (userEconomy) {
            isUserEconomy = '✅'
        } else {
            isUserEconomy = '❌'
        }

        if (userJob) {
            isUserJob = '✅'
        } else {
            isUserJob = '❌'
        }
        
        if (userBlacklist) {
            isUserBlacklisted = '✅'
        } else {
            isUserBlacklisted = '❌'
        }

        const res = new EmbedBuilder().setColor('Blurple');

        res.setTitle(`Informations sur ${target.username}`)
        res.addFields(
            {
                name: '**Pseudonyme**',
                value: target.username,
                inline: true
            },
            {
                name: '**Identifiant**',
                value: target.id,
                inline: true
            },
            {
                
            }
        )

    }
}