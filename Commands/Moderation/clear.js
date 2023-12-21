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
        .setMaxValue(98)
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
    const user = interaction.user.id;
    const target = interaction.options.getUser("utilisateur");
    const amount = interaction.options.getInteger("nombre");

    const messages = await interaction.channel.messages.fetch({
      limit: amount + 1,
    });

    const res = new EmbedBuilder().setColor("Green");

    if (target) {
      let i = 0;
      const filtered = [];

      (await messages).filter((msg) => {
        if (msg.author.id === target.id && amount > i) {
          filtered.push(msg);
          i++;
        }
      });

      await channel.bulkDelete(filtered).then((messages) => {
        res.setDescription(
          `J'ai supprimé ${messages.size} messages envoyés par ${target} !`
        );
        interaction.reply({ embeds: [res] });
      });
    } else {
      await interaction.channel.bulkDelete(amount, true).then((messages) => {
        res.setDescription(`J'ai supprimé ${messages.size} messages envoyés !`);
        interaction.reply({ embeds: [res] });
      });
    }
  },
};
