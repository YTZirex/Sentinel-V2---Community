const {
  SlashCommandBuilder,
  EmbedBuilder,
  CommandInteraction,
} = require("discord.js");

const { models, Schema } = require("mongoose");
const EconomySchema = require("../../Models/Economy");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("compte")
    .setDescription("Permet de voir ses informations bancaires."),
  async execute(interaction) {
    const userEconomyRecord = await EconomySchema.findOne({
      user: interaction.user.id,
    });

    if (!userEconomyRecord)
      return interaction.reply({
        content: `Veuillez vous créer un compte bancaire avec la commande /nouveaucompte`,
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
          value:`${userEconomyRecord.creditCardNumber}`,
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
      interaction.reply({
        embeds: [res],
        ephemeral: true,
      });
    }
  },
};
