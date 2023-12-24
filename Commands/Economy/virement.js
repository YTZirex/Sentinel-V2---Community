const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const guildModules = require("../../Models/GuildModules");
const EconomySchema = require("../../Models/Economy");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("virement")
    .setDescription(`Permet de faire un virement à un autre utilisateur.`)
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription(`Destinataire du virement.`)
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("montant")
        .setDescription(`Montant du virement.`)
        .setRequired(true)
    ),
  async execute(interaction) {
    const target = interaction.options.getUser("utilisateur");
    const amount = interaction.options.getNumber("montant");

    const guildModulesRecord = await guildModules.findOne({
      guild: interaction.guild.id,
    });
    const userEconomyRecord = await EconomySchema.findOne({ user: target.id });

    const resSuccess = new EmbedBuilder().setColor("Green");
    const resFail = new EmbedBuilder().setColor("Red");

    if (!guildModulesRecord) {
      const newGuildModulesRecord = new guildModules({
        guild: interaction.guild.id,
        economy: true,
        welcome: false,
      });
      await newGuildModulesRecord.save();
      interaction.reply({
        content: `Veuillez exécuter la commande à nouveau.`,
        ephemeral: true,
      });
      return;
    } else {
      if (guildModulesRecord.economy == false) {
        resFail.setTitle(`Le module \`Economy\` est désactivé sur ce serveur.`);
        interaction.reply({
          embeds: [resFail],
          ephemeral: true,
        });
        return;
      } else if (guildModulesRecord.economy == true) {
        // economy activated, do code:
        if (target.id == interaction.user.id) {
          resFail.setTitle(
            `Vous ne pouvez pas vous faire un virement à vous-même.`
          );
          interaction.reply({
            embeds: [resFail],
            ephemeral: true,
          });
          return;
        }

        if (!userEconomyRecord) {
          resFail.setTitle(`Vous ne possédez pas de compte bancaire.`);
          interaction.reply({
            embeds: [resFail],
            ephemeral: true,
          });
          return;
        }

        const targetEconomyRecord = await EconomySchema.findOne({
          user: target.id,
        });
        if (!targetEconomyRecord) {
          resFail.setTitle(`${target} ne possède pas de compte bancaire.`);
          interaction.reply({
            embeds: [resFail],
            ephemeral: true,
          });
          return;
        }

        if (amount > userEconomyRecord.balance) {
          resFail.setTitle(
            `Vous n'avez pas assez sur votre compte bancaire pour faire ce virement.`
          );
          interaction.reply({
            embeds: [resFail],
            ephemeral: true,
          });
          return;
        }

        if (userEconomyRecord.balance > amount) {
          userEconomyRecord.balance -= amount;
          targetEconomyRecord.balance += amount;
          resSuccess.setTitle(
            `Vous avez fait un virement de ${amount}€ à ${target}`
          );
          interaction.reply({
            embeds: [resSuccess],
            ephemeral: true,
          });
          return;
        }
      }
    }
  },
};
