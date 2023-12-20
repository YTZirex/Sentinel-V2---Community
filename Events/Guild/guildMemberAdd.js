const { EmbedBuilder, GuildMember } = require("discord.js");
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
      const newGuildRecord = new welcoemSchema({
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
            .setTitle(`Bienvenue ${member.username}!`)
            .setDescription(`${guildRecord.message}`)
            .addFields(
              {
                name: '**Membres:**',
                value: `${guild.memberCount}`
              }
            )
            .setTimestamp()
            .setThumbnail(guild.iconURL());
          const welcomeChannel = member.guild.channels.cache.get(guildRecord.channel)

          member.roles.add(guildRecord.role);
          
        }
      }
    }
  },
};
