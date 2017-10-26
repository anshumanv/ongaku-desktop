const { ipcRenderer } = require('electron');

window.onload = () => {
  const webview = document.querySelector('webview');
  webview.addEventListener('dom-ready', () => {
    webview.openDevTools();

    ipcRenderer.on('@@play', () => {
      webview.getWebContents().send('@@play');
    });

    ipcRenderer.on('@@pause', () => {
      webview.getWebContents().send('@@pause');
    });

    ipcRenderer.on('@@restart', () => {
      webview.getWebContents().send('@@restart');
    });
  });
}
