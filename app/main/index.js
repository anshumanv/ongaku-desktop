#!/usr/bin/env electron

const path = require('path')
const Tray = require('./tray.js')

const {
	app,
	BrowserWindow,
	globalShortcut,
	ipcMain,
	webContents
} = require('electron')

const {
	PLAY_SONG,
	PAUSE_SONG,
	RESTART_SONG
} = require('../shared/js/actions/types')

// Prevent window and tray from being garbage collected
let mainWindow
let tray
let closing

const mainURL = 'file://' + path.join(__dirname, '../renderer', 'index.html');

function onTrayToggle(e) {
		mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
}

function onTrayClose(e) {
	closing = true
	mainWindow.close();
}

function onClosing (e) {
	// The window has asked to be closed
	if(!closing) {
		mainWindow.hide();
		e.preventDefault();
	}
}

function onClosed () {
	// Dereference the window
	// For multiple windows store them in an array
	tray = null
	mainWindow = null
}

function createMainWindow () {
	const win = new BrowserWindow({
		width: 1280,
		height: 720,
		minWidth: 800,
		minHeight: 480,
		autoHideMenuBar: true,
		show: false
	})

	// loading the mainURL in our mainWindow
	win.loadURL(mainURL)

	// Handle onClose event
	win.on('close', onClosing)
	win.on('closed', onClosed)

	win.on('focus', () => {
		win.webContents.send('focus');
	})

	// Display the contents only when they are ready-to-show
	win.on('ready-to-show', () => {
		win.show()
	})
	return win
}

ipcMain.on('message', (e, action) => {
	if (tray) {
		tray.handleAction(action);
	}
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow()
	}
})

app.on('ready', () => {
	closing = false
	mainWindow = createMainWindow()

	tray = new Tray(onTrayToggle, onTrayClose)
	tray.on(PLAY_SONG, () => {
		mainWindow.webContents.send(PLAY_SONG)
	})
	tray.on(PAUSE_SONG, () => {
		mainWindow.webContents.send(PAUSE_SONG)
	})
	tray.on(RESTART_SONG, () => {
		mainWindow.webContents.send(RESTART_SONG)
	})

	const page = mainWindow.webContents
	page.on('dom-ready', () => {
		mainWindow.show()
	})
})
