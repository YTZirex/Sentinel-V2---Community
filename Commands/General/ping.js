const {
  SlashCommandBuilder,
  CommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Permet de voir le ping du bot et du client."),
  async execute(interaction, client) {
    await interaction.deferReply();
    const reply = await interaction.fetchReply();
    const ping = reply.createdTimestamp - interaction.createdTimestamp;

    const res = new EmbedBuilder()
      .setThumbnail(interaction.user.displayAvatarURL())
      .setTitle("🏓 Pong!")
      .addFields(
        {
          name: "👤 **Ping client:**",
          value: `${ping} ms.`,
        },
        {
          name: "🖥️ **Ping Serveur:** ",
          value: `${client.ws.ping} ms.`,
        }
      )
      .setTimestamp();

      await interaction.editReply({
      embeds: [res],
    });
  },
};
