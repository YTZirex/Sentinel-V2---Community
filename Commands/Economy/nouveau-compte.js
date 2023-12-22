const {
  SlashCommandBuilder,
  EmbedBuilder,
  CommandInteraction,
} = require("discord.js");

const { models, Schema } = require("mongoose");
const EconomySchema = require("../../Models/Economy");
const guildModuleSchema = require("../../Models/GuildModules");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nouveau-compte")
    .setDescription("Permet de créer un compte bancaire.")
    .addStringOption((option) =>
      option
        .setName("noms")
        .setDescription("Votre nom et prénom")
        .setRequired(true)
        .setMaxLength(24)
        .setMinLength(6)
    )
    .addStringOption((option) =>
      option
        .setName("naissance")
        .setDescription("Votre date de naissance (JJ/MM/AAAA)")
        .setMinLength(10)
        .setMaxLength(10)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("sexe")
        .setDescription("Votre sexe.")
        .addChoices(
          {
            name: "Homme",
            value: "H",
          },
          {
            name: "Femme",
            value: "F",
          }
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    const noms = interaction.options.getString("noms");
    const naissance = interaction.options.getString("naissance");
    const sexe = interaction.options.getString("sexe");

    const dateOfBirthRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

    if (!dateOfBirthRegex.test(naissance)) {
      return await interaction.reply({
        content: `Le format de la date de naissance est incorrect. Utilisez le format JJ/MM/AAAA.`,
        ephemeral: true,
      });
    }

    const birthDate = new Date(naissance);
    if (birthDate > eighteenYearsAgo) {
      return await interaction.reply({
        content: `Vous devez avoir au moins 18 ans pour créer un compte bancaire.`,
        ephemeral: true,
      });
    }

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

    console.log("a");
    const userEconomyRecord = await EconomySchema.findOne({
      user: interaction.user.id,
    });
    console.log("b");
    if (userEconomyRecord)
      return await interaction.reply({
        content: `Vous avez déjà un compte bancaire. Pour toutes modifications veuillez nous contacter sur notre <[Support](https://discord.gg/My2BVCmJEY)>.`,
        ephemeral: true,
      });

    console.log("ba");
    const uniqueCreditCardNumber = await generateCreditCard();
    const crypto = generateRandomNumber().toString();
    console.log("bb");
    const newUserEconomyRecord = new EconomySchema({
      user: interaction.user.id,
      names: noms,
      dateOfBirth: naissance,
      gender: sexe,
      balance: 0,
      creditCardNumber: uniqueCreditCardNumber.toString(),
      cvc: crypto.toString(),
      expirationDate: "11/27",
    });
    console.log("c");
    console.log(newUserEconomyRecord);
    await newUserEconomyRecord.save();
    console.log("d");

    const res = new EmbedBuilder()
      .setTitle("✅ **Nouveau compte crée!**")
      .addFields(
        {
          name: "👤 **Prénom et Nom :**",
          value: `${noms}`,
        },
        {
          name: "\u200a",
          value: "\u200a",
        },
        {
          name: "👶 **Date de naissance :**",
          value: `${naissance}`,
        },
        {
          name: "\u200a",
          value: "\u200a",
        },
        {
          name: "👤 **Sexe :**",
          value: `${sexe}`,
        },
        {
          name: "\u200a",
          value: "\u200a",
        },
        {
          name: "🏦 **Banque : **",
          value: "Zirexium Finance",
        },
        {
          name: "\u200a",
          value: "\u200a",
        },
        {
          name: "💸 **Solde: **",
          value: "0",
        },
        {
          name: "\u200a",
          value: "\u200a",
        },
        {
          name: "💳 **Numéro de carte bancaire :**",
          value: uniqueCreditCardNumber.toString(),
        },
        {
          name: "\u200a",
          value: "\u200a",
        },
        {
          name: "💳 **Cryptogramme :**",
          value: `${crypto}`,
        },
        {
          name: "\u200a",
          value: "\u200a",
        },
        {
          name: "💳** Date d'expiration :**",
          value: "11/27",
        }
      )
      .setTimestamp()
      .setThumbnail(interaction.user.displayAvatarURL());
    console.log("e");
    await interaction.reply({ embeds: [res], ephemeral: true });
    console.log("f");
  },
};

async function generateCreditCard() {
  const prefix = "4098 ";

  let isUnique = false;
  let generatedNumber;

  while (!isUnique) {
    const randomDigits = Array.from({ length: 12 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");

    // Add a space every four digits after the prefix
    const formattedNumber = prefix + randomDigits.replace(/(.{4})/g, "$1 ");

    generatedNumber = formattedNumber.trim(); // Remove trailing space

    // Check if the generated number already exists in the database
    const existingRecord = await EconomySchema.findOne({
      creditCardNumber: generatedNumber.toString(),
    });

    if (!existingRecord) {
      isUnique = true;
    }
    // If the number already exists, generate a new one in the next iteration
  }

  return generatedNumber;
}

function generateRandomNumber() {
  let randomNumber;

  do {
    randomNumber = Math.floor(Math.random() * 999) + 1;
  } while (randomNumber === 0);

  // Add leading zero for numbers between 1 and 99
  return randomNumber < 100
    ? `00${randomNumber}`.slice(-3)
    : randomNumber.toString();
}
