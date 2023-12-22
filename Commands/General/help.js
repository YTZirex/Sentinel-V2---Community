const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const commandDescription = require("../../commands.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription(`Permet de voir la liste des commandes.`)
    .addStringOption((option) =>
      option
        .setName("categorie")
        .setDescription("Catégorie de commandes")
        .setRequired(true)
        .addChoices(
          {
            name: "Administration",
            value: "admin",
          },
          {
            name: "Modération",
            value: "mod",
          },
          {
            name: "Economie",
            value: "economy",
          },
          {
            name: "Informations",
            value: "infos",
          },
          {
            name: "Divertissement",
            value: "fun",
          },
          {
            name: "Général",
            value: "general",
          },
          {
            name: "Sentinel Premium",
            value: "premium",
          }
        )
    ),
  async execute(interaction) {
    const category = interaction.options.getString("categorie");
    const res = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("Liste des commandes");

    switch (category) {
      case "admin":
        res.setTitle("🛠️** Administration**");
        res.addFields(
          {
            name: "</disable-economy:1187736150245392454>",
            value: commandDescription["disable-economy"],
          },
          {
            name: "</enable-economy:1187736150245392455>",
            value: commandDescription["enable-economy"],
          },
          {
            name: "</disable-welcome:1187086697427644476>",
            value: commandDescription["disable-welcome"],
          },
          {
            name: "</setup-welcome:1187086697427644477>",
            value: commandDescription["setup-welcome"],
          }
        );
        break;
      case "mod":
        res.setTitle("🛡️** Modération**");
        res.addFields({
          name: "</clear:1184765584345419798>",
          value: commandDescription["clear"],
        });
        break;
      case "economy":
        res.setTitle("💸** Economie**");
        res.addFields(
          {
            name: "</nouveau-compte:1186231398156222566>",
            value: commandDescription["nouveau-compte"],
          },
          {
            name: "</compte:1186231398156222565>",
            value: commandDescription["compte"],
          },
          {
            name: "</pole-emploi:1187473930236211339>",
            value: commandDescription["pole-emploi"],
          },
          {
            name: "</work:1187466944031494155>",
            value: commandDescription["work"],
          }
        );
        break;
      case "infos":
        res.setTitle("❓** Informations**");
        res.addFields({
          name: "</support:1186652337750671401>",
          value: commandDescription["support"],
        });
        break;
      case "fun":
        res.setTitle("🎮** Divertissement**");
        res.addFields({
          name: "</8ball:1184765584345419797>",
          value: commandDescription["8ball"],
        });
        break;
      case "general":
        res.setTitle(":scroll: **Général**");
        res.addFields(
          {
            name: "</help:1187752871047995462>",
            value: commandDescription["help"],
          },
          {
            name: "</ping:1184765584345419799>",
            value: commandDescription["ping"],
          }
        );
        break;
      case "premium":
        res.setTitle("⚡** Sentinel Premium**");
        res.addFields({
          name: "</claim-premium:1187035181551452200>",
          value: commandDescription["claim-premium"],
        });
        break;
    }

    return interaction.reply({ embeds: [res], ephemeral: true });
  },
};
