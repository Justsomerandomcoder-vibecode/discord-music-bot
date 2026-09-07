const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const createEmbed = (title, description, color = '#FF0000') => {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
};

const nowPlayingEmbed = (track, player) => {
  const duration = formatDuration(track.duration);
  const progress = player.currentTime ? formatDuration(player.currentTime) : '0:00';
  const loopMode = player.loopMode === 'off' ? '⏹️' : player.loopMode === 'track' ? '🔂' : '🔁';

  return new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle('🎵 Now Playing')
    .addFields(
      { name: 'Track', value: track.title, inline: false },
      { name: 'Artist', value: track.artist || 'Unknown', inline: true },
      { name: 'Duration', value: `${progress} / ${duration}`, inline: true },
      { name: 'Requester', value: `<@${track.requester}>`, inline: true },
      { name: 'Volume', value: `${player.volume}%`, inline: true },
      { name: 'Loop', value: loopMode, inline: true },
      { name: 'Queue Size', value: `${player.queue.size()} tracks`, inline: true }
    )
    .setThumbnail(track.thumbnail || 'https://via.placeholder.com/200')
    .setTimestamp();
};

const queueEmbed = (tracks, page = 1, maxPerPage = 10) => {
  const totalPages = Math.ceil(tracks.length / maxPerPage);
  const start = (page - 1) * maxPerPage;
  const end = start + maxPerPage;
  const pageQueueTracks = tracks.slice(start, end);

  const description = pageQueueTracks
    .map((track, i) => `**${start + i + 1}.** ${track.title} - ${formatDuration(track.duration)}`)
    .join('\n') || 'No tracks in queue';

  return new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle('📋 Queue')
    .setDescription(description)
    .setFooter({ text: `Page ${page}/${totalPages}` })
    .setTimestamp();
};

const successEmbed = (title, description) => {
  return new EmbedBuilder()
    .setColor('#00FF00')
    .setTitle(`✅ ${title}`)
    .setDescription(description)
    .setTimestamp();
};

const errorEmbed = (title, description) => {
  return new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle(`❌ ${title}`)
    .setDescription(description)
    .setTimestamp();
};

const formatDuration = (ms) => {
  if (!ms) return '0:00';
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${remainingMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const trackEmbed = (track) => {
  return new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle(track.title)
    .addFields(
      { name: 'Artist', value: track.artist || 'Unknown', inline: true },
      { name: 'Duration', value: formatDuration(track.duration), inline: true },
      { name: 'URL', value: `[Open](${track.url})`, inline: true }
    )
    .setThumbnail(track.thumbnail || 'https://via.placeholder.com/200')
    .setTimestamp();
};

module.exports = {
  createEmbed,
  nowPlayingEmbed,
  queueEmbed,
  successEmbed,
  errorEmbed,
  formatDuration,
  trackEmbed,
};
