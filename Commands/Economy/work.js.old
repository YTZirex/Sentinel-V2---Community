const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const EconomySchema = require("../../Models/Economy");
const JobSchema = require("../../Models/Job");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription(`Vous permet de travailler afin d'avoir un salaire.`)
    .addStringOption((option) =>
      option
        .setName("metier")
        .setDescription("Le métier que vous voulez faire.")
        .setRequired(true)
        .addChoices(
          {
            name: "Jardinier",
            value: "jardinier",
          },
          {
            name: "Ecrivain",
            value: "ecrivain",
          },
          {
            name: "Artiste",
            value: "artiste",
          },
          {
            name: "Codeur",
            value: "codeur",
          },
          {
            name: "Musicien",
            value: "musicien",
          },
          {
            name: "Cuisinier",
            value: "cuisinier",
          },
          {
            name: "Détective",
            value: "detective",
          },
          {
            name: "Cosmonaute",
            value: "cosmonaute",
          }
        )
    ),
  async execute(interaction) {
    const { options } = interaction;
    const metier = options.getString("metier");

    const userEconomyRecord = await EconomySchema.findOne({
      user: interaction.user.id,
    });

    const userJobRecord = await JobSchema.findOne({
      user: interaction.user.id,
    });

    if (!userEconomyRecord)
      return interaction.reply({
        content: `Veuillez créer un compte bancaire avec la commande </nouveaucompte:1186231398156222566> afin de pouvoir travailler.`,
        ephemeral: true,
      });

    const res = new EmbedBuilder().setColor("Green");

    if (!userJobRecord) {
      const newUserJobRecord = new JobSchema({
        user: interaction.user.id,
        job: "jardinier",
      });
      await newUserJobRecord.save();
      if (metier === "jardinier") {
        userEconomyRecord.balance += 20;
        await userEconomyRecord.save();
        res.setDescription(
          `Vous avez gagné 20 euros en travaillant en tant que Jardinier!`
        );
        interaction.reply({ embeds: [res], ephemeral: true });
        return;
      } else {
        interaction.reply({
          content: `Vous n'avez pas encore débloqué ce métier.`,
          ephemeral: true,
        });
        return;
      }
    } else {
      if (userJobRecord.job === metier) {
        let salaire;
        switch (metier) {
          case "jardinier":
            salaire = 20;
            break;
          case "ecrivain":
            salaire = 50;
            break;
          case "artiste":
            salaire = 100;
            break;
          case "codeur":
            salaire = 160;
            break;
          case "musicien":
            salaire = 220;
            break;
          case "cuisinier":
            salaire = 300;
            break;
          case "detective":
            salaire = 390;
            break;
          case "cosmonaute":
            salaire = 500;
            break;
        }
        userEconomyRecord.balance += salaire;
        await userEconomyRecord.save();
        res.setDescription(
          `Vous avez gagné ${salaire} euros en travaillant en tant que ${metier}!`
        );
        interaction.reply({ embeds: [res], ephemeral: true });
        return;
      } else if (userJobRecord.job !== metier) {
        interaction.reply({
          content: `Vous n'avez pas encore débloqué ce métier.`,
          ephemeral: true,
        });
        return;
      }
    }
  },
};
