const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const { models, Schema } = require("mongoose");
const welcomeSchema = require("../../Models/Welcome");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("disable-welcome")
    .setDescription(`Permet de désactiver le module de Bienvenue.`)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const guildRecord = await welcomeSchema.findOne({
      guild: interaction.guild.id,
    });

    if (guildRecord) {
      guildRecord.enabled = false;
      guildRecord.message = "none";
      guildRecord.channel = "none";
      guildRecord.role = "none";
      await guildRecord.save();
      const res = new EmbedBuilder()
        .setTitle(`Module désactivé!`)
        .setDescription(`Le module \`Bienvenue\` a été désactivé.\nPour activer le module, exécuter la commande `)
        .setTimestamp()
        .setColor("Red");
      await interaction.reply({
        embeds: [res],
        ephemeral: false,
      });
    } else {
      const newGuildRecord = new welcomeSchema({
        guild: interaction.guild.id,
        enabled: false,
        channel: "none",
        message: "none",
        role: "none",
      });
      await newGuildRecord.save();
      const res = new EmbedBuilder()
        .setTitle(`Module désactivé!`)
        .setDescription(`Le module \`Bienvenue\` a été désactivé.`)
        .setTimestamp()
        .setColor("Red");
      await interaction.reply({
        embeds: [res],
        ephemeral: false,
      });
    }
  },
};
