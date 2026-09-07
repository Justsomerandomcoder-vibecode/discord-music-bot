const checkVoicePermissions = (member, bot) => {
  const userVoiceChannel = member.voice.channel;
  
  if (!userVoiceChannel) {
    return { allowed: false, reason: 'You must be in a voice channel.' };
  }

  const botPermissions = userVoiceChannel.permissionsFor(bot.user);
  
  if (!botPermissions.has('Connect')) {
    return { allowed: false, reason: 'I don\'t have permission to connect to this voice channel.' };
  }

  if (!botPermissions.has('Speak')) {
    return { allowed: false, reason: 'I don\'t have permission to speak in this voice channel.' };
  }

  return { allowed: true };
};

const isBotInVoice = (guild) => {
  return guild.members.me.voice.channel ? true : false;
};

const isSameVoiceChannel = (member, guild) => {
  const userChannel = member.voice.channel;
  const botChannel = guild.members.me.voice.channel;
  
  if (!userChannel || !botChannel) return false;
  return userChannel.id === botChannel.id;
};

module.exports = {
  checkVoicePermissions,
  isBotInVoice,
  isSameVoiceChannel,
};
