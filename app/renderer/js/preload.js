/*
    This script will be loaded before other
    scripts run in the webview. See the docs
    for more info:

    https://electron.atom.io/docs/api/webview-tag/#preload
 */
window.onload = () => {
  const songs = (window.osts || []).concat(window.openings, window.endings);

  const getSongName = (src) => {
    if (!src) { return ''; }

    const len = songs.length;
    for (let i = 0; i < len; i++) {
      let song = songs[i];
      if (song.link === src) {
        return song.name;
      }
    }

    return '';
  };

  const notify = (title, body) => {
    const options = { body };
    let noti = new Notification(title, options);
    noti.addEventListener('click', () => {
      window.focus();
    });
  };

  let currentSong;
  const audio = document.querySelector('audio');

  // reset current song so play after pause shows notification
  audio.addEventListener('pause', () => currentSong = '');

  audio.addEventListener('playing', (e)=> {
    let src = e && e.target && e.target.currentSrc;
    let songName = getSongName(src);
    if (songName && songName !== currentSong) {
      currentSong = songName;
      notify('Now playing', songName);
    }
  });
};
