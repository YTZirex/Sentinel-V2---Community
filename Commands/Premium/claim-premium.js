const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { model, Schema } = require("mongoose");
const Code = require("../../Models/CodeSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("claim-premium")
    .setDescription("Permet de récupérer votre abonnement Sentinel Premium.")
    .setDMPermission(true)
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("Votre code d'abonnement.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const userId = interaction.user.id;
    const codeValue = interaction.options.getString("code");

    try {
      const code = await Code.findOne({ code: codeValue });

      if (!code) {
        const res = new EmbedBuilder()
          .setColor("Red")
          .setTitle("Oups!")
          .setDescription(`Votre code est invalide. Veuillez réessayer.`)
          .setTimestamp();
        await interaction.reply({ embeds: [res], ephemeral: true });
        return;
      }

      if (code.redeemedBy && code.redeemedBy.id) {
        const embed = new EmbedBuilder()
          .setTitle("Oups!")
          .setColor("Red")
          .setDescription(`Ce code a déjà été utilisé.`)
          .setTimestamp();
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      const existingCode = await Code.findOne({
        "redeemedBy.id": userId,
      });

      if (existingCode) {
        const res = new EmbedBuilder()
          .setTitle("Oups!")
          .setColor("Red")
          .setDescription(`Vous avez déjà un abonnement en cours.`)
          .setTimestamp();
        await interaction.reply({ embeds: [res], ephemeral: true });
        return;
      }

      const codeExpiration = new Date();
      const codeLength = code.length;
      const expirationLengths = {
        quotidien: 1,
        hebdomadaire: 7,
        mensuel: 30,
        annuel: 365,
        "14 jours": 14,
        "30 jours": 30,
        "60 jours": 60,
        "90 jours": 90,
        "permanent": 1826250,
      };

      const expirationLength =
        expirationLengths[codeLength] || parseInt(codeLength);

      if (isNaN(expirationLength)) {
        const res = new EmbedBuilder()
          .setTitle("Oups!")
          .setColor("Red")
          .setDescription(`Le code a une durée invalide.`)
          .setTimestamp();
        await interaction.reply({ embeds: [res], ephemeral: true });
        return;
      }

      codeExpiration.setDate(codeExpiration.getDate() + expirationLength);

      const redeemedUser = {
        id: interaction.user.id,
        username: interaction.user.username,
      };

      const redeemedOn = new Date();

      await Code.updateOne(
        {
          code: codeValue,
        },
        {
          $set: {
            redeemedBy: redeemedUser,
            redeemedOn: redeemedOn,
            expiresAt: codeExpiration,
          },
        }
      );

      const res = new EmbedBuilder()
        .setTitle("Youpi!")
        .setAuthor({
          name: "Code Utilisé",
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setDescription(
          `Vous avez utilisé le code avec succès. Bienvenue chez Sentinel Premium!`
        )
        .addFields(
          {
            name: "Code:",
            value: `${codeValue}`,
            inline: true,
          },
          {
            name: "Durée:",
            value: `${codeLength}`,
            inline: true,
          },
          {
            name: "Expire dans:",
            value: `<t:${Math.floor(codeExpiration.getTime() / 1000)}:R>`,
            inline: true,
          }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [res], ephemeral: true });
      
    } catch (error) {
      console.error(error);

      const res = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Oups!")
        .setDescription(
          "Une erreur s'est produite pendant la récupération. Veuillez réessayer plus tard."
        )
        .setTimestamp();
      await interaction.reply({ embeds: [res], ephemeral: true });
      return;
    }
  },
};
