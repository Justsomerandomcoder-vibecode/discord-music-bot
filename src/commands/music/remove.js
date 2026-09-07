const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const playerManager = require('../music/PlayerManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove a track from the queue')
    .addIntegerOption(option =>
      option.setName('position').setDescription('Queue position').setRequired(true).setMinValue(1)
    ),

  async execute(interaction) {
    const { guild } = interaction;
    const position = interaction.options.getInteger('position') - 1;

    try {
      const player = playerManager.getPlayer(guild.id);

      if (player.queue.size() === 0) {
        return interaction.reply({
          embeds: [errorEmbed('Empty Queue', 'No tracks to remove')],
          ephemeral: true,
        });
      }

      if (position < 0 || position >= player.queue.size()) {
        return interaction.reply({
          embeds: [errorEmbed('Invalid Position', `Position must be between 1 and ${player.queue.size()}`)],
          ephemeral: true,
        });
      }

      const removed = player.queue.remove(position);
      interaction.reply({
        embeds: [successEmbed('Removed', `❌ Removed: ${removed.title}`)],
      });
    } catch (error) {
      console.error('Error in remove command:', error);
      interaction.reply({
        embeds: [errorEmbed('Error', 'Failed to remove track')],
        ephemeral: true,
      });
    }
  },
};
