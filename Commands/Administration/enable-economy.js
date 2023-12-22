const {
  SlashCommandBuilder,
  EmbedBuilder,
  CommandInteraction,
  PermissionFlagsBits,
} = require("discord.js");

const { models, Schema } = require("mongoose");
const EconomySchema = require("../../Models/Economy");
const guildModuleSchema = require("../../Models/GuildModules");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("enable-economy")
    .setDescription(`Permet d'activer le module Economy.`)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const guildModulesRecord = await guildModuleSchema.findOne({
      guild: interaction.guild.id,
    });
    const res = new EmbedBuilder().setColor("Green");

    if (!guildModulesRecord) {
      const newGuildModulesRecord = new guildModuleSchema({
        guild: interaction.guild.id,
        economy: true,
        welcome: false,
      });
      await newGuildModulesRecord.save();
      res.setDescription(
        `Le module \`Economy\` a été activé.\nPour désactiver le module, exécuter la commande /disable-economy.`
      );
      interaction.reply({
        embeds: [res],
        ephemeral: false,
      });
      return;
    } else if (guildModulesRecord) {
      if (guildModulesRecord.economy == true)
        return interaction.reply({
          content: `Le module \`Economy\` est déjà activé.`,
          ephemeral: true,
        });
      guildModulesRecord.economy = true;
      await guildModulesRecord.save();
      res.setDescription(
        `Le module \`Economy\` a été activé.\nPour désactiver le module, exécuter la commande /disable-economy.`
      );
      return;
    }
  },
};
