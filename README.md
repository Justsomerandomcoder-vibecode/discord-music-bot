# Discord Music Bot 🎵

A modern, reliable, modular Discord Music Bot built with discord.js v14.

## Features

✅ **Playback Controls**
- Play music/audio from YouTube and supported URLs
- Pause, Resume, Skip, Stop
- Automatic idle disconnect

✅ **Queue Management**
- Queue system with pagination
- Remove, Move, Clear, Shuffle queue items
- Skip to specific queue position
- Play next, Play top

✅ **Audio Controls**
- Volume control (0-100)
- Track loop, Queue loop, Loop disable
- Now Playing display with progress

✅ **Search**
- Search for tracks with Discord Select Menu
- Display multiple results

✅ **Favorites**
- Like/Unlike tracks
- Persistent favorites (survive bot restarts)
- View all liked tracks

✅ **Multi-Guild Support**
- Independent music player per Discord server
- Separate queues and settings per guild

✅ **User Experience**
- Beautiful Discord Embeds
- Help command with grouped commands
- Friendly error handling
- Auto-disconnect when bot is alone

## Requirements

- Node.js 16.0.0 or higher
- npm or yarn
- Discord Bot Token
- Discord Server to test in

## Installation

### 1. Clone & Install

```bash
git clone https://github.com/Justsomerandomcoder-vibecode/discord-music-bot.git
cd discord-music-bot
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here
```

### 3. Discord Developer Portal Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Go to "Bot" → Click "Add Bot"
4. Under TOKEN, click "Copy" → Paste into `.env` as `DISCORD_TOKEN`
5. Go to "OAuth2" → "General"
6. Copy CLIENT ID → Paste into `.env` as `CLIENT_ID`
7. Go to your Discord server, right-click it → "Copy Server ID" → Paste as `GUILD_ID`

### 4. Bot Permissions

The bot requires these permissions:

- **General**: Read Messages/View Channels, Send Messages, Embed Links, Manage Messages
- **Voice**: Connect, Speak, Use Voice Activity

Invite URL format:
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=274878549056&scope=bot+applications.commands
```

Replace `YOUR_CLIENT_ID` with your actual Client ID.

### 5. Deploy Commands

```bash
npm run deploy
```

This registers all slash commands with Discord.

### 6. Start the Bot

```bash
npm start
```

The bot should connect and show "Bot ready!" in the console.

## Commands

### 🎵 Playback Commands

| Command | Aliases | Description |
|---------|---------|-------------|
| `/play <query>` | `p` | Play a song or add to queue |
| `/playskip <query>` | `ps, pskip, playnow, pn` | Skip current and play immediately |
| `/playtop <query>` | `pt, ptop` | Add to top of queue without interrupting |
| `/pause` | - | Pause playback |
| `/resume` | - | Resume paused playback |
| `/skip` | `s, next` | Skip to next track |
| `/stop` | `disconnect, dc, leave` | Stop playback and disconnect |

### 📋 Queue Commands

| Command | Aliases | Description |
|---------|---------|-------------|
| `/queue` | `q` | Display current queue (paginated) |
| `/remove <position>` | - | Remove track at position |
| `/move <from> <to>` | - | Move track in queue |
| `/clear` | - | Clear all upcoming tracks |
| `/shuffle` | - | Shuffle queue |
| `/skipto <position>` | - | Skip to specific queue position |

### 🔊 Audio Commands

| Command | Aliases | Description |
|---------|---------|-------------|
| `/volume <0-100>` | `vol` | Set playback volume |
| `/loop <mode>` | - | Toggle loop (off, track, queue) |
| `/nowplaying` | `np, now` | Display currently playing track |

### 🔎 Search & Favorites

| Command | Aliases | Description |
|---------|---------|-------------|
| `/search <query>` | - | Search for tracks (select to play) |
| `/like` | `heart, love, grab` | Like current track |
| `/liked` | `likes, favorites, favourites` | View liked tracks |

### ⚙️ Utility

| Command | Aliases | Description |
|---------|---------|-------------|
| `/join` | `summon, start` | Join your voice channel |
| `/help` | - | Display all commands |

## Troubleshooting

### Bot doesn't connect
- Check `DISCORD_TOKEN` is correct
- Verify bot has CONNECT permission in voice channel
- Ensure bot is invited to server with `applications.commands` scope

### Commands don't appear
- Run `npm run deploy`
- Wait 1-2 minutes for Discord to sync
- Check `CLIENT_ID` and `GUILD_ID` are correct

### No sound in voice channel
- Verify bot has SPEAK permission
- Check volume with `/volume`
- Try `/stop` then `/play` again

### Favorites not persisting
- Check `data/` directory exists
- Verify `data/favorites.db` file exists
- Check file permissions

## Development

Run in development mode with auto-reload:

```bash
npm run dev
```

## Project Structure

```
discord-music-bot/
├── src/
│   ├── index.js                 # Main bot entry point
│   ├── deploy-commands.js       # Command deployment script
│   ├── commands/
│   │   └── music/               # All music commands
│   ├── music/                   # Music system core
│   ├── database/                # Database handler
│   ├── events/                  # Discord event handlers
│   ├── utils/                   # Utility functions
│   └── config/                  # Configuration
├── data/
│   └── favorites.db             # SQLite database (auto-created)
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Architecture

**PlayerManager**: Manages one MusicPlayer per guild
**MusicPlayer**: Handles voice connection, audio playback, queue for one guild
**Queue**: Track management (add, remove, shuffle, etc.)
**Track**: Represents a single audio track

Each guild is completely isolated - no shared queue, volume, or player state.

## Security

- Bot token is never logged
- `.env` is automatically ignored by Git
- No sensitive data is stored in database
- No listening history is collected

## License

MIT

## Support

For issues or questions, create an issue on GitHub.

---

**Built with discord.js v14 and @discordjs/voice** 🎵
