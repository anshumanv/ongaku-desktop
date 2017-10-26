const {
  PLAY_SONG,
  PAUSE_SONG
} = require('./types');

const playSong = (song) => ({
  type: PLAY_SONG,
  song
});

const pauseSong = (song) => ({
  type: PAUSE_SONG,
  song
});

module.exports = {
    playSong,
    pauseSong
};
