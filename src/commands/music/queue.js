const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { errorEmbed } = require('../utils/embeds');
const { formatDuration } = require('../utils/embeds');
const playerManager = require('../music/PlayerManager');
const config = require('../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('View the current queue')
    .addIntegerOption(option =>
      option.setName('page').setDescription('Page number').setMinValue(1)
    ),

  async execute(interaction) {
    const { guild } = interaction;
    const page = interaction.options.getInteger('page') || 1;

    try {
      const player = playerManager.getPlayer(guild.id);

      if (!player.currentTrack && player.queue.size() === 0) {
        return interaction.reply({
          embeds: [errorEmbed('Empty Queue', 'No tracks are queued')],
          ephemeral: true,
        });
      }

      const tracks = player.queue.toArray();
      const totalPages = Math.ceil(tracks.length / config.MAX_QUEUE_DISPLAY);
      const start = (page - 1) * config.MAX_QUEUE_DISPLAY;
      const end = start + config.MAX_QUEUE_DISPLAY;
      const pageQueueTracks = tracks.slice(start, end);

      let description = '';

      if (player.currentTrack) {
        description += `**🎵 Now Playing:**\n${player.currentTrack.title} - ${formatDuration(player.currentTrack.duration)}\n\n**📋 Up Next:**\n`;
      }

      if (pageQueueTracks.length === 0) {
        description += 'No tracks in queue';
      } else {
        description += pageQueueTracks
          .map((track, i) => `**${start + i + 1}.** ${track.title} - ${formatDuration(track.duration)}`)
          .join('\n');
      }

      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('📋 Queue')
        .setDescription(description)
        .setFooter({ text: `Page ${page}/${totalPages || 1} | Total: ${tracks.length} tracks` })
        .setTimestamp();

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in queue command:', error);
      interaction.reply({
        embeds: [errorEmbed('Error', 'Failed to display queue')],
        ephemeral: true,
      });
    }
  },
};
