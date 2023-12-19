const {
  SlashCommandBuilder,
  EmbedBuilder,
  CommandInteraction,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("support")
    .setDescription("Permet d'avoir le lien d'invitation de notre Support."),
  async execute(interaction) {
    interaction.reply({
      content: `https://discord.gg/My2BVCmJEY`,
      ephemeral: true,
    });
  },
};
