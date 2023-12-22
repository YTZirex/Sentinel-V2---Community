const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const { models, Schema } = require("mongoose");
const welcomeSchema = require("../../Models/Welcome");
const guildModuleSchema = require("../../Models/GuildModules");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("disable-welcome")
    .setDescription(`Permet de désactiver le module Welcome.`)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const guildRecord = await welcomeSchema.findOne({
      guild: interaction.guild.id,
    });

    const guildModulesRecord = await guildModuleSchema.findOne({
      guild: interaction.guild.id,
    });

    if (guildRecord) {
      if (guildModulesRecord) {
        if (guildModulesRecord.welcome == false) return await interaction.reply({
          content: `Le module \`Welcome\` est déjà désactivé.`,
          ephemeral: true,
        })
        guildModulesRecord.welcome = false;
        await guildModulesRecord.save();
      } else if (!guildModulesRecord) {
        const newGuildModulesRecord = new guildModuleSchema({
          guild: interaction.guild.id,
          economy: true,
          welcome: false,
        });
        await newGuildModulesRecord.save();
      }
      guildRecord.message = "none";
      guildRecord.channel = "none";
      guildRecord.role = "none";
      await guildRecord.save();
      const res = new EmbedBuilder()
        .setTitle(`Module désactivé!`)
        .setDescription(
          `Le module \`Welcome\` a été désactivé.\nPour activer le module, exécuter la commande </setup-welcome:1187086697427644477>`
        )
        .setTimestamp()
        .setColor("Red");
      await interaction.reply({
        embeds: [res],
        ephemeral: false,
      });
    } else {
      const newGuildRecord = new welcomeSchema({
        guild: interaction.guild.id,
        channel: "none",
        message: "none",
        role: "none",
      });
      await newGuildRecord.save();

      if (guildModulesRecord) {
        if (guildModulesRecord.welcome == false) return interaction.reply({
          content: `Le module \`Welcome\` est déjà désactivé.`,
          ephemeral: true,
        })
        guildModulesRecord.welcome = false;
        await guildModulesRecord.save();
      } else if (!guildModulesRecord) {
        const newGuildModulesRecord = new guildModuleSchema({
          guild: interaction.guild.id,
          economy: true,
          welcome: false,
        });
        await newGuildModulesRecord.save();
      }
      const res = new EmbedBuilder()
        .setTitle(`Module désactivé!`)
        .setDescription(
          `Le module \`Welcome\` a été désactivé.\nPour activer le module, exécuter la commande </setup-welcome:1187086697427644477>`
        )
        .setTimestamp()
        .setColor("Red");
      await interaction.reply({
        embeds: [res],
        ephemeral: false,
      });
    }
  },
};
