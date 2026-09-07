module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`
✅ Bot is ready! Logged in as ${client.user.tag}`);
    console.log(`📊 Serving ${client.guilds.cache.size} guild(s)\n`);
    
    client.user.setActivity('🎵 /help for commands', { type: 'LISTENING' });
  },
};
