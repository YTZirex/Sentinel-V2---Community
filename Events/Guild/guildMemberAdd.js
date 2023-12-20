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
        try {
          const res = new EmbedBuilder()
            .setTitle(`Bienvenue ${member}!`)
            .setDescription(`${guildRecord.message}`)
            .setTimestamp()
            .setThumbnail(guild.iconURL());
          guild.channels.cache.get(guildRecord.channel).send({
            embeds: [res],
          });

          member.roles.add(guildRecord.role);
          return;
        } catch (err) {
          console.error(err);
          return;
        }
      }
    }
  },
};
