class Queue {
  constructor() {
    this.tracks = [];
  }

  add(track) {
    this.tracks.push(track);
    return this.tracks.length;
  }

  addTop(track) {
    this.tracks.unshift(track);
    return this.tracks.length;
  }

  remove(index) {
    if (index < 0 || index >= this.tracks.length) {
      return null;
    }
    return this.tracks.splice(index, 1)[0];
  }

  move(from, to) {
    if (from < 0 || from >= this.tracks.length || to < 0 || to >= this.tracks.length) {
      return false;
    }
    const track = this.tracks.splice(from, 1)[0];
    this.tracks.splice(to, 0, track);
    return true;
  }

  clear() {
    this.tracks = [];
  }

  shuffle() {
    for (let i = this.tracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]];
    }
  }

  get(index) {
    return this.tracks[index] || null;
  }

  size() {
    return this.tracks.length;
  }

  next() {
    return this.tracks.shift();
  }

  current() {
    return this.tracks[0] || null;
  }

  toArray() {
    return [...this.tracks];
  }
}

module.exports = Queue;
