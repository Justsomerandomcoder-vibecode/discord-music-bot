const MusicPlayer = require('./MusicPlayer');

class PlayerManager {
  constructor() {
    this.players = new Map();
  }

  getPlayer(guildId) {
    if (!this.players.has(guildId)) {
      this.players.set(guildId, new MusicPlayer(guildId));
    }
    return this.players.get(guildId);
  }

  deletePlayer(guildId) {
    const player = this.players.get(guildId);
    if (player) {
      player.disconnect();
      this.players.delete(guildId);
    }
  }

  hasPlayer(guildId) {
    return this.players.has(guildId);
  }
}

module.exports = new PlayerManager();
