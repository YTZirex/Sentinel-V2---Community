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
        return res.addFields(
          {
            name: "\u200b",
            value: "🛠️** Administration**",
          },
          {
            name: "\u200a",
            value: "\u200a",
          },
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
        return res.addFields(
          {
            name: "\u200b",
            value: "🛡️** Modération**",
          },
          {
            name: "\u200a",
            value: "\u200a",
          },
          {
            name: "</clear:1184765584345419798>",
            value: commandDescription["clear"],
          }
        );
        break;
      case "economy":
        return res.addFields(
          {
            name: "\u200b",
            value: "💸** Economie**",
          },
          {
            name: "\u200a",
            value: "\u200a",
          },
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
        return res.addFields(
          {
            name: "\u200b",
            value: "❓** Informations**",
          },
          {
            name: "\u200a",
            value: "\u200a",
          },
          {
            name: "</support:1186652337750671401>",
            value: commandDescription["support"],
          }
        );
        break;
      case "fun":
        return res.addFields(
          {
            name: "\u200b",
            value: "🎮** Divertissement**",
          },
          {
            name: "\u200a",
            value: "\u200a",
          },
          {
            name: "</8ball:1184765584345419797>",
            value: commandDescription["8ball"],
          }
        );
        break;
      case "general":
        return res.addFields(
          {
            name: "\u200b",
            value: ":scroll:** Général",
          },
          {
            name: "\u200a",
            value: "\u200a",
          },
          {
            name: "</help:",
            value: commandDescription["help"],
          },
          {
            name: "</ping:1184765584345419799>",
            value: commandDescription["ping"],
          }
        );
        break;
      case "premium":
        return res.addFields(
          {
            name: "\u200b",
            value: "⚡** Sentinel Premium**",
          },
          {
            name: "\u200a",
            value: "\u200a",
          },
          {
            name: "</claim-premium:1187035181551452200>",
            value: commandDescription["claim-premium"],
          }
        );
        break;
    }

    return interaction.reply({ embeds: [res], ephemeral: true });
  },
};
