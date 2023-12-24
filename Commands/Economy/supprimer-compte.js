const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const guildModules = require("../../Models/Economy");
const EconomySchema = require("../../Models/Economy");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("supprimer-compte")
    .setDescription(`Permet de supprimer votre compte bancaire.`)
    .setDMPermission(false),
  async execute(interaction) {
    const guildModulesRecord = await guildModules.findOne({
      guild: interaction.guild.id,
    });
    const userEconomyRecord = await EconomySchema.findOne({
      user: interaction.user.id,
    });

    const resSuccess = new EmbedBuilder().setColor("Green");
    const resFail = new EmbedBuilder().setColor("Red");

    if (!guildModulesRecord) {
      const newGuildModulesRecord = new guildModules({
        guild: interaction.guild.id,
        economy: true,
        welcome: false,
      });
      await newGuildModulesRecord.save();
      interaction.reply({
        content: `Veuillez exécuter la commande à nouveau.`,
        ephemeral: true,
      });
      return;
    }

    if (guildModulesRecord) {
      if (guildModulesRecord.economy == false) {
        resFail.setTitle(`Le module \`Economy\` est désactivé sur ce serveur.`);
        interaction.reply({
          embeds: [resFail],
          ephemeral: true,
        });
        return;
      } else if (guildModulesRecord.economy == true) {
        if (!userEconomyRecord) {
          resFail.setTitle(`Vous ne possédez pas de compte bancaire.`);
          interaction.reply({
            embeds: [resFail],
            ephemeral: true,
          });
          return;
        } else if (userEconomyRecord) {
          await EconomySchema.findOneAndDelete({
            user: interaction.user.id,
          });
          resSuccess.setTitle(`Votre compte bancaire a bien été supprimé.`);
          interaction.reply({
            embeds: [resSuccess],
            ephemeral: true,
          });
          return;
        }
      }
    }
  },
};
