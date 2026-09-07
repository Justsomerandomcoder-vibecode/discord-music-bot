const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const playerManager = require('../music/PlayerManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip to the next track'),

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

      const skipped = player.currentTrack.title;
      player.skip();

      // Play next track if available
      if (player.queue.size() > 0) {
        const nextTrack = player.queue.current();
        await player.playTrack(nextTrack);
        interaction.reply({
          embeds: [successEmbed('Skipped', `⏭️ Now playing: ${nextTrack.title}`)],
        });
      } else {
        interaction.reply({
          embeds: [successEmbed('Skipped', `⏭️ ${skipped}\n(Queue ended)`)],
        });
      }
    } catch (error) {
      console.error('Error in skip command:', error);
      interaction.reply({
        embeds: [errorEmbed('Error', 'Failed to skip track')],
        ephemeral: true,
      });
    }
  },
};
