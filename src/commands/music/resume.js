const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const playerManager = require('../music/PlayerManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume paused playback'),

  async execute(interaction) {
    const { guild } = interaction;

    try {
      const player = playerManager.getPlayer(guild.id);

      if (!player.currentTrack) {
        return interaction.reply({
          embeds: [errorEmbed('No Track', 'Nothing to resume')],
          ephemeral: true,
        });
      }

      const resumed = player.resume();
      if (!resumed) {
        return interaction.reply({
          embeds: [errorEmbed('Not Paused', 'Playback is not paused')],
          ephemeral: true,
        });
      }

      interaction.reply({
        embeds: [successEmbed('Resumed', `▶️ ${player.currentTrack.title}`)],
      });
    } catch (error) {
      console.error('Error in resume command:', error);
      interaction.reply({
        embeds: [errorEmbed('Error', 'Failed to resume playback')],
        ephemeral: true,
      });
    }
  },
};
