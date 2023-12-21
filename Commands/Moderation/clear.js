const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

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
        .setMaxValue(100)
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription(
          "Permet de supprimer les messages d'un utilisateur spécifique."
        )
        .setRequired(false)
    ),
  async execute(interaction) {
    const { channel, options } = interaction;

    let amount = options.getInteger("nombre");
    const target = options.getUser("utilisateur");

    const multiMsg = amount === 1 ? "message" : "messages";

    if (!amount || amount > 100 || amount < 1) {
      return await interaction.reply({
        content: `Veuillez spécifier un nombre entre 1 et 100 avant de supprimer les messages.`,
        ephemeral: true,
      });
    }

    try {
      const channelMessages = await channel.messages.fetch();

      if (channelMessages.size === 0) {
        return await interaction.reply({
          content: `Il n'y a pas de messages dans ce salon à supprimer.`,
          ephemeral: true,
        });
      }

      if (amount > channelMessages.size) amount = channelMessages;

      const res = new EmbedBuilder().setColor("Green");

      await interaction.deferReply({
        ephemeral: true,
      });

      let messagesToDelete = [];

      if (target) {
        let i = 0;
        channelMessages.forEach((m) => {
          if (m.author.id === target.id && messagesToDelete.length < amount) {
            messagesToDelete.push(m);
            i++;
          }
        });

        clearEmbed.setDescription(
          `\`✅\` J'ai supprimé \`${messagesToDelete.length}\` ${multiMsg} de ${target} dans ce salon.`
        );
      } else {
        messagesToDelete = channelMessages.first(amount);
        clearEmbed.setDescription(
          `\`✅\` J'ai supprimé \`${messagesToDelete.length}\` ${multiMsg} dans ce salon.`
        );
      }

      if (messagesToDelete.length > 0) {
        await channel.bulkDelete(messagesToDelete, true);
      }

      await interaction.editReply({
        embeds: [res],
      });
    } catch (err) {
      console.error(err);
      await interaction.followUp({
        content: `Une erreur s'est produite pendant la suppression des messages.`,
        ephemeral: true,
      });
    }
  },
};
