const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const playerManager = require('../music/PlayerManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skipto')
    .setDescription('Skip to a specific queue position')
    .addIntegerOption(option =>
      option.setName('position').setDescription('Queue position to skip to').setRequired(true).setMinValue(1)
    ),

  async execute(interaction) {
    const { guild } = interaction;
    const position = interaction.options.getInteger('position') - 1;

    try {
      const player = playerManager.getPlayer(guild.id);

      if (player.queue.size() === 0) {
        return interaction.reply({
          embeds: [errorEmbed('Empty Queue', 'No tracks to skip to')],
          ephemeral: true,
        });
      }

      if (position < 0 || position >= player.queue.size()) {
        return interaction.reply({
          embeds: [errorEmbed('Invalid Position', `Position must be between 1 and ${player.queue.size()}`)],
          ephemeral: true,
        });
      }

      // Remove all tracks before the target position
      for (let i = 0; i < position; i++) {
        player.queue.next();
      }

      player.skip();
      const nextTrack = player.queue.current();
      if (nextTrack) {
        await player.playTrack(nextTrack);
        interaction.reply({
          embeds: [successEmbed('Skipped', `⏩ Now playing: ${nextTrack.title}`)],
        });
      } else {
        interaction.reply({
          embeds: [successEmbed('Skipped', '⏩ Queue ended')],
        });
      }
    } catch (error) {
      console.error('Error in skipto command:', error);
      interaction.reply({
        embeds: [errorEmbed('Error', 'Failed to skip to position')],
        ephemeral: true,
      });
    }
  },
};
