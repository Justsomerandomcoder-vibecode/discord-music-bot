class Track {
  constructor(title, url, duration, artist = 'Unknown', thumbnail = null, requester = null, source = 'youtube') {
    this.title = title;
    this.url = url;
    this.duration = duration; // in milliseconds
    this.artist = artist;
    this.thumbnail = thumbnail;
    this.requester = requester;
    this.source = source;
  }

  toJSON() {
    return {
      title: this.title,
      url: this.url,
      duration: this.duration,
      artist: this.artist,
      thumbnail: this.thumbnail,
      requester: this.requester,
      source: this.source,
    };
  }
}

module.exports = Track;
