const {
  SlashCommandBuilder,
  EmbedBuilder,
  CommandInteraction,
} = require("discord.js");

const { models, Schema } = require("mongoose");
const EconomySchema = require("../../Models/Economy");
const guildModuleSchema = require('../../Models/GuildModules');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("compte")
    .setDescription("Permet de voir ses informations bancaires.")
    .setDMPermission(false),
  async execute(interaction) {
    const userEconomyRecord = await EconomySchema.findOne({
      user: interaction.user.id,
    });

    const guildModulesRecord = await guildModuleSchema.findOne({
      guild: interaction.guild.id,
    })

    const moduleDisabled = new EmbedBuilder().setColor("Red");
    if (guildModulesRecord) {
      if (guildModulesRecord.economy == false) {
        moduleDisabled.setDescription(`Le module \`Economy\` est désactivé sur ce serveur. Veuillez exécuter la commande dans un autre serveur ou dans notre Support.`)
        await interaction.reply({
          embeds: [moduleDisabled],
          ephemeral: true
        })
        return;
      }
    }

    if (!userEconomyRecord)
      return await interaction.reply({
        content: `Veuillez vous créer un compte bancaire avec la commande </nouveau-compte:1187839966710087812>.`,
        ephemeral: true,
      });

    if (userEconomyRecord) {
      const res = new EmbedBuilder()
        .setTitle("**Mon compte**")
        .addFields(
          {
            name: "👤 **Prénom et Nom :**",
            value: `${userEconomyRecord.names}`,
          },
          {
            name: "\u200a",
            value: "\u200a",
          },
          {
            name: "👶 **Date de naissance :**",
            value: `${userEconomyRecord.dateOfBirth}`,
          },
          {
            name: "\u200a",
            value: "\u200a",
          },
          {
            name: "👤 **Sexe :**",
            value: `${userEconomyRecord.gender}`,
          },
          {
            name: "\u200a",
            value: "\u200a",
          },
          {
            name: "🏦 **Banque : **",
            value: "Zirexium Finance",
          },
          {
            name: "\u200a",
            value: "\u200a",
          },
          {
            name: "💸 **Solde: **",
            value: `${userEconomyRecord.balance}`,
          },
          {
            name: "\u200a",
            value: "\u200a",
          },
          {
            name: "💳 **Numéro de carte bancaire :**",
            value: `${userEconomyRecord.creditCardNumber}`,
          },
          {
            name: "\u200a",
            value: "\u200a",
          },
          {
            name: "💳 **Cryptogramme :**",
            value: `${userEconomyRecord.cvc}`,
          },
          {
            name: "\u200a",
            value: "\u200a",
          },
          {
            name: "💳** Date d'expiration :**",
            value: `${userEconomyRecord.expirationDate}`,
          }
        )
        .setTimestamp()
        .setThumbnail(interaction.user.displayAvatarURL());
      await interaction.reply({
        embeds: [res],
        ephemeral: true,
      });
    }
  },
};
