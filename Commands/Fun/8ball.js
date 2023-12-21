const {
  SlashCommandBuilder,
  CommandInteraction,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  premiumOnly: false,
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Permet de demander au bot une question.")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("Votre question")
        .setRequired(true),
    ),
  async execute(interaction) {
    const question = interaction.options.getString("question");

    const answers = [
      "Oui",
      "Non",
      "Sans doute",
      "Probablement",
      "Je ne pense pas",
      "Bien évidemment",
      "Jamais",
      "Bien sûr que non",
      "Bien sûr que oui",
    ];

    function chosenAnswer() {
      const number = Math.floor(Math.random() * 8);

      const answer = answers[number];
      return answer;
    }

    const res = new EmbedBuilder()
      .setColor("Blurple")
      .setTimestamp()
      .setTitle("Réponse de la boule magique")
      .addFields(
        {
          name: "**Question : **",
          value: question,
          inline: true,
        },
        {
          name: "**Réponse : **",
          value: chosenAnswer(),
          inline: true,
        },
      );

    interaction.reply({ embeds: [res] });
  },
};
