const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const { checkVoicePermissions } = require('../utils/permissions');
const playerManager = require('../music/PlayerManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Join your voice channel'),

  async execute(interaction) {
    const { member, guild } = interaction;

    // Check voice permissions
    const voiceCheck = checkVoicePermissions(member, guild.members.me);
    if (!voiceCheck.allowed) {
      return interaction.reply({
        embeds: [errorEmbed('Cannot Join', voiceCheck.reason)],
        ephemeral: true,
      });
    }

    try {
      const player = playerManager.getPlayer(guild.id);

      // Check if already in same channel
      if (player.voiceConnection && player.voiceChannelId === member.voice.channel.id) {
        return interaction.reply({
          embeds: [errorEmbed('Already Connected', `Already in ${member.voice.channel.name}`)],
          ephemeral: true,
        });
      }

      const joined = await player.joinChannel(member.voice.channel);
      if (!joined) {
        return interaction.reply({
          embeds: [errorEmbed('Connection Failed', 'Could not join voice channel')],
          ephemeral: true,
        });
      }

      interaction.reply({
        embeds: [successEmbed('Joined', `🎤 Connected to ${member.voice.channel.name}`)],
      });
    } catch (error) {
      console.error('Error in join command:', error);
      interaction.reply({
        embeds: [errorEmbed('Error', 'Failed to join voice channel')],
        ephemeral: true,
      });
    }
  },
};
