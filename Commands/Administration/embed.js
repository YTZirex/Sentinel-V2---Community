const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const buttonPagination = require('../../Utils/buttonPagination')
module.exports = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Envois un embed test")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    try {
      const embeds = [];
      for (let i = 0; i < 4; i++) {
        embeds.push(new EmbedBuilder().setDescription(`Page ${i + 1}`));
      }

      await buttonPagination(interaction, embeds);
    } catch (err) {
      console.error(err);
    }
  },
};
