const { models, Schema } = require("mongoose");
const welcomeSchema = require("../../Models/Welcome");
const guildModuleSchema = require("../../Models/GuildModules");
module.exports = {
  name: "guildCreate",
  async execute(guild) {
    const guildRecord = await welcomeSchema.findOne({
      guild: guild.id,
    });

    const guildModulesRecord = await guildModuleSchema.findOne({
      guild: guild.id,
    });

    if (!guildModulesRecord) {
      const newGuildModulesRecord = new guildModuleSchema({
        guild: guild.id,
        economy: true,
        welcome: false,
      });
      await newGuildModulesRecord.save();
    }

    if (guildModulesRecord) {
      guildModulesRecord.guild = guild.id;
      guildModulesRecord.economy = true;
      guildModulesRecord.welcome = false;
      await guildModulesRecord.save();
    }

    if (!guildRecord) {
      const newGuildRecord = new welcomeSchema({
        guild: guild.id,
        channel: "none",
        message: "none",
        role: "none",
      });
      await newGuildRecord.save();
    }

    if (guildRecord) {
      guildRecord.guild = guild.id;
      guildRecord.channel = "none";
      guildRecord.message = "none";
      guildRecord.role = "none";
      await guildRecord.save();
    }
  },
};
