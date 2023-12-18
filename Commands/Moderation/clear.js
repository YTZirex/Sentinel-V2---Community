const {
  SlashCommandBuilder,
  CommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  Client
} = require("discord.js");
const client = Client;
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
    const { channel, options } = interaction;
    const nombre = options.getInteger("nombre");
    const utilisateur = options.getUser("utilisateur");

    const messages = await channel.messages.fetch({
      limit: nombre + 1,
    });
    const res = new EmbedBuilder().setColor("Green");
    
    if (utilisateur) {
      let i = 0;
      const filtered = [];

      (await messages).filter((msg) => {
        if (msg.author.id === utilisateur.id && nombre > i) {
          filtered.push(msg);
          i++;
        }
      });

      await channel.bulkDelete(filtered).then((messages) => {
        res.setDescription(
          `J'ai supprimé ${messages.size} messages de ${utilisateur}.`
        );
        interaction.reply({ embeds: [res] });
      });
    } else {
      await channel.bulkDelete(nombre, true).then((messages) => {
        res.setDescription(
          `J'ai supprimé ${messages.size} messages dans le salon.`
        );
        interaction.reply({ embeds: [res] });
      });
    }
  },
};
