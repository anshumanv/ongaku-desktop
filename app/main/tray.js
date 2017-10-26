const path = require('path');
const electron = require('electron');

const { Menu, Tray } = electron;
const IMG_FOLDER = path.join(__dirname, '../assets/icons/tray');
const {
	PLAY_SONG,
	PAUSE_SONG,
	RESTART_SONG
} = require('../shared/js/actions/types');

const TRAY_EVENTS = {
	[PLAY_SONG]: true,
	[PAUSE_SONG]: true,
	[RESTART_SONG]: true
};

let trayImage;
if (process.platform == 'win32') {
	trayImage = path.join(IMG_FOLDER, 'win', 'icon.ico');
} else if (process.platform == 'darwin') {
	trayImage = path.join(IMG_FOLDER, 'osx', 'iconTemplate.png');
} else {
	trayImage = path.join(IMG_FOLDER, 'png', 'icon.png');
}

class OngakuTray {
	constructor(onToggle, onClose) {
		this._tray = new Tray(trayImage);
		this._tray.on('click', onToggle);
		this._tray.setTitle('Ongaku');
		this._tray.setToolTip('Ongaku');

		this._onToggle = onToggle;
		this._onClose = onClose;
		this._initContextMenu();

		this._isPlaying = true;
		this._events = {};
	}

	_initContextMenu(playPauseLabel) {
		this._tray.setContextMenu(
			this._getMenu(playPauseLabel || 'Pause')
		);
	}

	_getMenu(playPauseLabel) {
		const menu = Menu.buildFromTemplate([
			{
				label: playPauseLabel,
				click: () => this._onPlayPause()
			},
			{
				label: 'Restart',
				click: () => this._onRestart()
			},
			{
				label: 'Toggle Show/Hide',
				click: () => this._onToggle()
			},
			{
				label: 'Quit',
				click: () => this._onClose()
			}
		]);
		return menu;
	}

	_onPlayPause() {
		this.dispatchAction(
			(this._isPlaying) ? PAUSE_SONG : PLAY_SONG
		);
	}

	_onRestart() {
		this.dispatchAction(RESTART_SONG);
	}

	handleAction(action) {
		switch(action.type) {
			case PLAY_SONG:
				this._isPlaying = true;
				this._tray.setToolTip(action.song);
				// must rebuild the menu for Linux to take the update
				this._initContextMenu('Pause');
				break;
			case PAUSE_SONG:
				this._isPlaying = false;
				// must rebuild the menu for Linux to take the update
				this._initContextMenu('Play');
				break;
			default:
				// do nothing
		}
	}

	dispatchAction(type) {
		if (this._events[type]) {
			this._events[type].forEach((handler) => {
				if (typeof handler === 'function') {
					handler();
				}
			});
		}
	}

	on(event, handler) {
		if (TRAY_EVENTS[event]) {
			this._events[event] = (this._events[event] || []).concat(handler);
		}
	}
}

module.exports = OngakuTray;
