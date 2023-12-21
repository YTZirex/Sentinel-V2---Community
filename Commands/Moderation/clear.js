const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Permet de supprimer des messages dans un salon.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) =>
      option
        .setName("nombre")
        .setDescription("Nombre de messages à supprimer.")
        .setMinValue(1)
        .setMaxValue(99)
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("Supprimer les messages d'un utilisateur spécifique.")
        .setRequired(false)
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply();

      const { channel, options } = interaction;
      const nombre = options.getInteger("nombre");
      const utilisateur = options.getUser("utilisateur");

      const messages = await channel.messages.fetch({ limit: nombre });
      const messagesFiltres = utilisateur
        ? messages.filter((msg) => msg.author.id === utilisateur.id)
        : messages;

      const messagesFiltresASupprimer = messagesFiltres.filter(
        (msg) => Date.now() - msg.createdTimestamp < 14 * 24 * 60 * 60 * 1000
      );

      await channel.bulkDelete(messagesFiltresASupprimer, true);

      const res = new EmbedBuilder().setColor("Green");
      res.setDescription(
        `J'ai supprimé ${messagesFiltresASupprimer.size} messages${utilisateur ? ` de ${utilisateur}` : ""}.`
      );

      await interaction.editReply({ embeds: [res] });
    } catch (error) {
      console.error(error);
      const resError = new EmbedBuilder().setColor("Red");
      resError.setDescription(
        "Une erreur s'est produite. Veuillez réessayer plus tard."
      );
      await interaction.editReply({ embeds: [resError] });
    }
  },
};
