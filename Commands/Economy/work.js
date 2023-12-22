const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const EconomySchema = require("../../Models/Economy");
const JobSchema = require("../../Models/Job");
const guildModuleSchema = require("../../Models/GuildModules");

var cooldown = [];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Vous permet de gagner de l'argent en travaillant."),
  async execute(interaction) {
    const userId = interaction.user.id;

    if (!cooldown.includes(userId)) {
      const userJobRecord = await JobSchema.findOne({ user: userId });
      const userEconomyRecord = await EconomySchema.findOne({ user: userId });

      const guildModulesRecord = await guildModuleSchema.findOne({
        guild: interaction.guild.id,
      });

      const moduleDisabled = new EmbedBuilder().setColor("Red");
      if (guildModulesRecord) {
        if (guildModulesRecord.economy == false) {
          moduleDisabled.setDescriptionr(
            `Le module \`Economy\` est désactivé sur ce serveur. Veuillez exécuter la commande dans un autre serveur ou dans notre Support.`
          );
          interaction.reply({
            embeds: [moduleDisabled],
            ephemeral: true,
          });
        }
      }

      if (!userEconomyRecord)
        return interaction.reply({
          content: `Veuillez créer un compte bancaire avec la commande </nouveaucompte:1186231398156222566> afin de pouvoir travailler.`,
          ephemeral: true,
        });

      if (!userJobRecord)
        return interaction.reply({
          content: `Veuillez trouver un travail avec la commande </pole-emploi:1187473930236211339> afin de pouvoir travailler.`,
          ephemeral: true,
        });
      let salaire;
      let userJob = userJobRecord.job;
      switch (userJob) {
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

      userEconomyRecord.salaire += salaire;
      await userEconomyRecord.save();
      const res = new EmbedBuilder()
        .setColor("Green")
        .setDescription(
          `Vous avez gagné ${salaire} en travaillant en tant que ${userJobRecord.job}!`
        );

      await interaction.reply({ embeds: [res], ephemeral: true });
      cooldown.push(interaction.user.id);
      setTimeout(() => {
        cooldown.shift();
      }, 43200000);
    } else {
      await interaction.reply({
        content: `Vous pouvez seulement travailler toutes les 12 heures.`,
        ephemeral: true,
      });
    }
  },
};
