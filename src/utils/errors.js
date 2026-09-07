class BotError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR') {
    super(message);
    this.name = 'BotError';
    this.code = code;
  }
}

class VoiceError extends BotError {
  constructor(message) {
    super(message, 'VOICE_ERROR');
    this.name = 'VoiceError';
  }
}

class TrackError extends BotError {
  constructor(message) {
    super(message, 'TRACK_ERROR');
    this.name = 'TrackError';
  }
}

class QueueError extends BotError {
  constructor(message) {
    super(message, 'QUEUE_ERROR');
    this.name = 'QueueError';
  }
}

const handleError = (error, interaction = null) => {
  console.error(`[${new Date().toISOString()}] Error:`, error);
  
  const errorMessage = error.message || 'An unknown error occurred.';
  const userFriendlyMessage = getUserFriendlyMessage(error);
  
  if (interaction && !interaction.replied) {
    interaction.reply({
      content: `❌ ${userFriendlyMessage}`,
      ephemeral: true,
    }).catch(err => console.error('Failed to send error message:', err));
  }
};

const getUserFriendlyMessage = (error) => {
  if (error instanceof VoiceError) {
    return error.message;
  }
  if (error instanceof TrackError) {
    return error.message;
  }
  if (error instanceof QueueError) {
    return error.message;
  }
  return 'Something went wrong. Please try again later.';
};

module.exports = {
  BotError,
  VoiceError,
  TrackError,
  QueueError,
  handleError,
  getUserFriendlyMessage,
};
