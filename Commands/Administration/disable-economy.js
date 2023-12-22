const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const { models, Schema } = require("mongoose");
const EconomySchema = require("../../Models/Economy");
const guildModuleSchema = require("../../Models/GuildModules");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("disable-economy")
    .setDescription(`Permet de désactiver le module Economy.`)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const guildModulesRecord = await guildModuleSchema.findOne({
      guild: interaction.guild.id,
    });
    const res = new EmbedBuilder().setColor("Red");
    if (!guildModulesRecord) {
      const newGuildModulesRecord = new guildModuleSchema({
        guild: interaction.guild.id,
        economy: false,
        welcome: false,
      });
      await newGuildModulesRecord.save();
      res.setDescription(
        `Le module \`Economy\` a été désactivé.\nPour activer le module, exécuter la commande </enable-economy:1187736150245392455>.`
      );
      await interaction.reply({
        embeds: [res],
        ephemeral: false,
      });
      return;
    } else if (guildModulesRecord) {
      if (guildModulesRecord.economy == false)
        return await interaction.reply({
          content: `Le module \`Economy\` est déjà désactivé.`,
          ephemeral: true,
        });
      guildModulesRecord.economy = false;
      await guildModulesRecord.save();
      res.setDescription(
        `Le module \`Economy\` a été désactivé.\nPour activer le module, exécuter la commande </enable-economy:1187736150245392455>.`
      );
      await interaction.reply({
        embeds: [res],
        ephemeral: false,
      });
      return;
    }
  },
};
