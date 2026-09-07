const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const playerManager = require('../music/PlayerManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause current playback'),

  async execute(interaction) {
    const { guild } = interaction;

    try {
      const player = playerManager.getPlayer(guild.id);

      if (!player.currentTrack) {
        return interaction.reply({
          embeds: [errorEmbed('No Track', 'Nothing is currently playing')],
          ephemeral: true,
        });
      }

      const paused = player.pause();
      if (!paused) {
        return interaction.reply({
          embeds: [errorEmbed('Already Paused', 'Playback is already paused')],
          ephemeral: true,
        });
      }

      interaction.reply({
        embeds: [successEmbed('Paused', `⏸️ ${player.currentTrack.title}`)],
      });
    } catch (error) {
      console.error('Error in pause command:', error);
      interaction.reply({
        embeds: [errorEmbed('Error', 'Failed to pause playback')],
        ephemeral: true,
      });
    }
  },
};
