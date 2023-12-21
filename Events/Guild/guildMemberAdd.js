const {
  EmbedBuilder,
  GuildMember,
  PermissionFlagsBits,
} = require("discord.js");
const { models, Schema } = require("mongoose");
const welcomeSchema = require("../../Models/Welcome");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const { user, guild } = member;
    const guildRecord = await welcomeSchema.findOne({
      guild: guild.id,
    });

    if (!guildRecord) {
      const newGuildRecord = new welcomeSchema({
        guild: guild.id,
        enabled: false,
        channel: "none",
        message: "none",
        role: "none",
      });
      await newGuildRecord.save();
      return;
    } else {
      if (guildRecord.enabled == false) return;
      if (guildRecord.enabled == true) {
        const res = new EmbedBuilder()
          .setTitle(`Bienvenue ${member.user.username}!`)
          .setThumbnail(member.user.displayAvatarURL())
          .setDescription(`${guildRecord.message}`)
          .addFields({
            name: "**Membres:**",
            value: `${guild.memberCount}`,
          })
          .setTimestamp()
          .setColor("Blurple")
          .setThumbnail(guild.iconURL());
        const welcomeChannel = member.guild.channels.cache.get(
          guildRecord.channel,
        );

        if (
          welcomeChannel
            .permissionsFor(guild.members.me)
            .has(PermissionFlagsBits.SendMessages)
        ) {
          welcomeChannel.send({
            embeds: [res],
          });
        }

        // Check if the role is set and not "none"
        if (guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles) && guild.members.me.roles.highest.position > guildRecord.role.position) {
          member.roles.add(guildRecord.role);
        } else {
          console.log('pas la perm')
        }
      }
    }
  },
};
