const {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  joinVoiceChannel,
  VoiceConnectionStatus,
} = require('@discordjs/voice');
const { exec } = require('child_process');
const { promisify } = require('util');
const Queue = require('./Queue');

const execPromise = promisify(exec);

class MusicPlayer {
  constructor(guildId) {
    this.guildId = guildId;
    this.queue = new Queue();
    this.audioPlayer = createAudioPlayer();
    this.voiceConnection = null;
    this.currentTrack = null;
    this.isPaused = false;
    this.volume = 50;
    this.loopMode = 'off'; // 'off', 'track', 'queue'
    this.voiceChannelId = null;
    this.idleTimeout = null;
    this.currentTime = 0;
  }

  async joinChannel(channel) {
    try {
      this.voiceConnection = joinVoiceChannel({
        channelId: channel.id,
        guildId: this.guildId,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });

      this.voiceChannelId = channel.id;

      this.voiceConnection.subscribe(this.audioPlayer);

      await entersState(this.voiceConnection, VoiceConnectionStatus.Ready, 30e3);
      return true;
    } catch (error) {
      console.error('Failed to join voice channel:', error);
      return false;
    }
  }

  async playTrack(track) {
    try {
      this.currentTrack = track;
      this.currentTime = 0;

      const audioUrl = await this.getStreamUrl(track.url);
      const resource = createAudioResource(audioUrl);

      this.audioPlayer.play(resource);
      this.isPaused = false;

      return true;
    } catch (error) {
      console.error('Failed to play track:', error);
      return false;
    }
  }

  async getStreamUrl(url) {
    try {
      // Use youtube-dl-exec equivalent
      const { stdout } = await execPromise(
        `yt-dlp -f bestaudio -g "${url}"`,
        { timeout: 30000 }
      );
      return stdout.trim();
    } catch (error) {
      console.error('Failed to extract stream URL:', error);
      throw new Error('Could not extract audio stream from URL');
    }
  }

  pause() {
    if (this.audioPlayer.state.status === AudioPlayerStatus.Playing) {
      this.audioPlayer.pause();
      this.isPaused = true;
      return true;
    }
    return false;
  }

  resume() {
    if (this.audioPlayer.state.status === AudioPlayerStatus.Paused) {
      this.audioPlayer.unpause();
      this.isPaused = false;
      return true;
    }
    return false;
  }

  skip() {
    this.stop();
    return true;
  }

  stop() {
    this.audioPlayer.stop();
    this.currentTrack = null;
    this.currentTime = 0;
    this.isPaused = false;
  }

  setVolume(volume) {
    if (volume < 0 || volume > 100) {
      return false;
    }
    this.volume = volume;
    return true;
  }

  setLoop(mode) {
    if (!['off', 'track', 'queue'].includes(mode)) {
      return false;
    }
    this.loopMode = mode;
    return true;
  }

  disconnect() {
    if (this.voiceConnection) {
      this.voiceConnection.destroy();
      this.voiceConnection = null;
    }
    this.stop();
    this.queue.clear();
    this.voiceChannelId = null;
    this.clearIdleTimeout();
  }

  setIdleTimeout(callback, timeout = 5 * 60 * 1000) {
    this.clearIdleTimeout();
    this.idleTimeout = setTimeout(callback, timeout);
  }

  clearIdleTimeout() {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
      this.idleTimeout = null;
    }
  }

  isPlaying() {
    return this.audioPlayer.state.status === AudioPlayerStatus.Playing;
  }

  isPausedState() {
    return this.audioPlayer.state.status === AudioPlayerStatus.Paused;
  }
}

module.exports = MusicPlayer;
