const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const playerManager = require('../music/PlayerManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('move')
    .setDescription('Move a track in the queue')
    .addIntegerOption(option =>
      option.setName('from').setDescription('Current position').setRequired(true).setMinValue(1)
    )
    .addIntegerOption(option =>
      option.setName('to').setDescription('New position').setRequired(true).setMinValue(1)
    ),

  async execute(interaction) {
    const { guild } = interaction;
    const from = interaction.options.getInteger('from') - 1;
    const to = interaction.options.getInteger('to') - 1;

    try {
      const player = playerManager.getPlayer(guild.id);

      if (player.queue.size() === 0) {
        return interaction.reply({
          embeds: [errorEmbed('Empty Queue', 'No tracks to move')],
          ephemeral: true,
        });
      }

      if (from < 0 || from >= player.queue.size() || to < 0 || to >= player.queue.size()) {
        return interaction.reply({
          embeds: [errorEmbed('Invalid Position', `Positions must be between 1 and ${player.queue.size()}`)],
          ephemeral: true,
        });
      }

      const moved = player.queue.move(from, to);
      if (!moved) {
        return interaction.reply({
          embeds: [errorEmbed('Move Failed', 'Could not move track')],
          ephemeral: true,
        });
      }

      interaction.reply({
        embeds: [successEmbed('Moved', `↔️ Moved track from position ${from + 1} to ${to + 1}`)],
      });
    } catch (error) {
      console.error('Error in move command:', error);
      interaction.reply({
        embeds: [errorEmbed('Error', 'Failed to move track')],
        ephemeral: true,
      });
    }
  },
};
