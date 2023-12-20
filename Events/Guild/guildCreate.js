const { models, Schema } = require("mongoose");
const welcomeSchema = require("../../Models/Welcome");

module.exports = {
  name: "guildCreate",
  async execute(guild) {
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
    }

    if (guildRecord) {
      guildRecord.guild = guild.id;
      guildRecord.enabled = false;
      guildRecord.channel = "none";
      guildRecord.message = "none";
      guildRecord.role = "none";
      await guildRecord.save();
      return;
    }
  },
};
