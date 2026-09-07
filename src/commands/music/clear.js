const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const playerManager = require('../music/PlayerManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear the queue'),

  async execute(interaction) {
    const { guild } = interaction;

    try {
      const player = playerManager.getPlayer(guild.id);

      if (player.queue.size() === 0) {
        return interaction.reply({
          embeds: [errorEmbed('Empty Queue', 'Queue is already empty')],
          ephemeral: true,
        });
      }

      const size = player.queue.size();
      player.queue.clear();

      interaction.reply({
        embeds: [successEmbed('Cleared', `🧹 Removed ${size} track(s) from queue`)],
      });
    } catch (error) {
      console.error('Error in clear command:', error);
      interaction.reply({
        embeds: [errorEmbed('Error', 'Failed to clear queue')],
        ephemeral: true,
      });
    }
  },
};
