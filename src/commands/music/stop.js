const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const playerManager = require('../music/PlayerManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop playback and disconnect'),

  async execute(interaction) {
    const { guild, member } = interaction;

    try {
      const player = playerManager.getPlayer(guild.id);

      if (!player.voiceConnection) {
        return interaction.reply({
          embeds: [errorEmbed('Not Connected', 'Bot is not in a voice channel')],
          ephemeral: true,
        });
      }

      player.disconnect();
      playerManager.deletePlayer(guild.id);

      interaction.reply({
        embeds: [successEmbed('Disconnected', '⏹️ Stopped playback and left voice channel')],
      });
    } catch (error) {
      console.error('Error in stop command:', error);
      interaction.reply({
        embeds: [errorEmbed('Error', 'Failed to stop playback')],
        ephemeral: true,
      });
    }
  },
};
