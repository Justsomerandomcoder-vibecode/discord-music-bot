const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const { checkVoicePermissions } = require('../utils/permissions');
const playerManager = require('../music/PlayerManager');
const Track = require('../music/Track');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song or add to queue')
    .addStringOption(option =>
      option.setName('query').setDescription('Song name or URL').setRequired(true)
    ),

  async execute(interaction) {
    const { member, guild } = interaction;
    const query = interaction.options.getString('query');

    // Check voice permissions
    const voiceCheck = checkVoicePermissions(member, guild.members.me);
    if (!voiceCheck.allowed) {
      return interaction.reply({
        embeds: [errorEmbed('Cannot Join', voiceCheck.reason)],
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    try {
      const player = playerManager.getPlayer(guild.id);

      // Join voice channel if not already connected
      if (!player.voiceConnection) {
        const joined = await player.joinChannel(member.voice.channel);
        if (!joined) {
          return interaction.editReply({
            embeds: [errorEmbed('Connection Failed', 'Could not join voice channel')],
          });
        }
      }

      // Create a basic track (in production, you'd search YouTube)
      const track = new Track(
        query,
        query,
        300000, // 5 minutes default
        'Unknown Artist',
        null,
        member.id,
        'youtube'
      );

      player.queue.add(track);

      // If nothing is playing, start playing
      if (!player.currentTrack) {
        const playing = await player.playTrack(track);
        if (playing) {
          return interaction.editReply({
            embeds: [successEmbed('Now Playing', `🎵 ${track.title}`)],
          });
        }
      }

      interaction.editReply({
        embeds: [successEmbed('Added to Queue', `📋 ${track.title}\n(Position: ${player.queue.size()})`)],
      });
    } catch (error) {
      console.error('Error in play command:', error);
      interaction.editReply({
        embeds: [errorEmbed('Error', 'Failed to play track')],
      });
    }
  },
};
