const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { models, Schema } = require("mongoose");
const welcomeSchema = require("../../Models/Welcome");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-welcome")
    .setDescription(`Permet d'annoncer quand un membre rejoint le serveur.`)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption((option) =>
      option
        .setName("salon")
        .setDescription("Salon où annoncer quand un membre rejoint.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Message de bienvenue")
        .setRequired(true)
        .setMaxLength(200)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Role à ajouter quand l'utilisateur rejoint.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const activatedChoice = interaction.options.getBoolean("actif");
    const chosenChannel = interaction.options.getChannel("salon");
    const chosenMessage = interaction.options.getString("message");
    const chosenRole = interaction.options.getRole("role");
    const guildRecord = await welcomeSchema.findOne({
      guild: interaction.guild.id,
    });

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) return interaction.reply({ 
        content: `Je n'ai pas la permission d'envoyer de message dans ce salon.`, 
        ephemeral: true
    })

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) return interaction.reply({
        content: `Je n'ai pas la permission de gérer les rôles d'autres utilisateurs.`,
        ephemeral: true
    });

    if (!guildRecord) {
      const newGuildRecord = new welcomeSchema({
        guild: interaction.guild.id,
        enabled: true,
        channel: chosenChannel.id,
        message: chosenMessage,
        role: chosenRole.id,
      });
      await newGuildRecord.save();
      const res = new EmbedBuilder()
        .setTitle("Module activé!")
        .setDescription(`Le module \`Bienvenue\` a été activé.`)
        .setTimestamp()
        .setColor("Green")
        .addFields(
          {
            name: "**Salon:**",
            value: `${chosenChannel}`,
            inline: true,
          },
          {
            name: "**Message:**",
            value: `${chosenMessage}`,
            inline: true,
          },
          {
            name: `**Role:**`,
            value: `<@&${chosenRole.id}>`,
            inline: true,
          }
        );
      interaction.reply({
        embeds: [res],
        ephemeral: true,
      });
    } else {
      guildRecord.enabled = true;
      guildRecord.channel = chosenChannel.id;
      guildRecord.message = chosenMessage;
      guildRecord.role = chosenRole.id;

      await guildRecord.save();
      const res = new EmbedBuilder()
        .setTitle("Module activé!")
        .setDescription(`Le module \`Bienvenue\` a été activé.`)
        .setTimestamp()
        .setColor("Green")
        .addFields(
          {
            name: "**Salon:**",
            value: `${chosenChannel}`,
            inline: true,
          },
          {
            name: "**Message:**",
            value: `${chosenMessage}`,
            inline: true,
          },
          {
            name: `**Role:**`,
            value: `<@&${chosenRole.id}>`,
            inline: true,
          }
        );
      interaction.reply({
        embeds: [res],
        ephemeral: true,
      });
    }
  },
};
