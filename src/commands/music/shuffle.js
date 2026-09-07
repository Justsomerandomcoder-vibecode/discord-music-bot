const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const playerManager = require('../music/PlayerManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffle the queue'),

  async execute(interaction) {
    const { guild } = interaction;

    try {
      const player = playerManager.getPlayer(guild.id);

      if (player.queue.size() === 0) {
        return interaction.reply({
          embeds: [errorEmbed('Empty Queue', 'Cannot shuffle empty queue')],
          ephemeral: true,
        });
      }

      player.queue.shuffle();

      interaction.reply({
        embeds: [successEmbed('Shuffled', `🔀 Queue shuffled (${player.queue.size()} tracks)`)],
      });
    } catch (error) {
      console.error('Error in shuffle command:', error);
      interaction.reply({
        embeds: [errorEmbed('Error', 'Failed to shuffle queue')],
        ephemeral: true,
      });
    }
  },
};
