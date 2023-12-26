const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const EconomySchema = require("../../Models/Economy");
const JobSchema = require("../../Models/Job");
const guildModuleSchema = require("../../Models/GuildModules");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pole-emploi")
    .setDescription(`Permet de récupérer un travail.`)
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("metier")
        .setDescription("Le métier que vous voulez faire.")
        .setRequired(true)
        .addChoices(
          {
            name: "0€ - Jardinier",
            value: "jardinier",
          },
          {
            name: "500€ - Ecrivain",
            value: "ecrivain",
          },
          {
            name: "1 000€ - Artiste",
            value: "artiste",
          },
          {
            name: "1 500€ - Codeur",
            value: "codeur",
          },
          {
            name: "2 000€ - Musicien",
            value: "musicien",
          },
          {
            name: "2 500€ - Cuisinier",
            value: "cuisinier",
          },
          {
            name: "3 000€ - Détective",
            value: "detective",
          },
          {
            name: "5 000€ - Pilote d'avion",
            value: "pilote",
          },
          {
            name: "10 000€ - Cosmonaute",
            value: "cosmonaute",
          }
        )
    ),
  async execute(interaction) {
    const userId = interaction.user.id;
    const metier = interaction.options.getString("metier");

    const userJobRecord = await JobSchema.findOne({ user: userId });
    const userEconomyRecord = await EconomySchema.findOne({ user: userId });

    const res = new EmbedBuilder().setColor("Green");

    const guildModulesRecord = await guildModuleSchema.findOne({
      guild: interaction.guild.id,
    });

    const moduleDisabled = new EmbedBuilder().setColor("Red");
    if (guildModulesRecord) {
      if (guildModulesRecord.economy == false) {
        moduleDisabled.setDescription(
          `Le module \`Economy\` est désactivé sur ce serveur. Veuillez exécuter la commande dans un autre serveur ou dans notre Support.`
        );
        await interaction.reply({
          embeds: [moduleDisabled],
          ephemeral: true,
        });
        return;
      }
    }

    if (!userEconomyRecord)
      return await interaction.reply({
        content: `Veuillez créer un compte bancaire avec la commande </nouveaucompte:1186231398156222566> avant de pouvoir travailler.`,
        ephemeral: true,
      });

    let prix;
    switch (metier) {
      case "jardinier":
        prix = 0;
        break;
      case "ecrivain":
        prix = 500;
        break;
      case "artiste":
        prix = 1000;
        break;
      case "codeur":
        prix = 1500;
        break;
      case "musicien":
        prix = 2000;
        break;
      case "cuisinier":
        prix = 2500;
        break;
      case "detective":
        prix = 3000;
        break;
      case "pilote":
        prix = 5000;
        break;
      case "cosmonaute":
        prix = 10000;
        break;
    }

    if (!userJobRecord) {
      const newUserJobRecord = new JobSchema({
        user: userId,
        job: "jardinier",
      });
      await newUserJobRecord.save();
      if (userEconomyRecord.balance >= prix) {
        newUserJobRecord.job = metier.toString();
        await newUserJobRecord.save();
        userEconomyRecord.balance -= prix;
        await userEconomyRecord.save();
        res.setDescription(`Vous travaillez désormais en tant que ${metier}!`);
        await interaction.reply({ embeds: [res], ephemeral: true });
      } else {
        return await interaction.reply({
          content: `Vous n'avez pas assez d'argent pour travailler en tant que ${metier}!`,
          ephemeral: true,
        });
      }
    } else {
      if (userJobRecord.job === metier.toString()) {
        return await interaction.reply({
          content: `Vous travaillé déjà en tant que ${metier}!`,
          ephemeral: true,
        });
      } else {
        if (userEconomyRecord.balance >= prix) {
          userJobRecord.job = metier.toString();
          await userJobRecord.save();
          userEconomyRecord.balance -= prix;
          await userEconomyRecord.save();
          res.setDescription(
            `Vous travaillez désormais en tant que ${metier}!`
          );
          await interaction.reply({ embeds: [res], ephemeral: true });
        } else {
          return await interaction.reply({
            content: `Vous n'avez pas assez d'argent pour travailler en tant que ${metier}!`,
            ephemeral: true,
          });
        }
      }
    }
  },
};
