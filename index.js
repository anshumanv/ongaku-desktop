#!/usr/bin/env electron

const electron = require('electron')

const {app, BrowserWindow, globalShortcut} = electron

// Adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')()

// Prevent window being garbage collected
let mainWindow, webContents

function onClosed () {
	// Dereference the window
	// For multiple windows store them in an array
	mainWindow = null
}

function createMainWindow () {
	const win = new BrowserWindow({
		width: 1280,
		height: 720,
		frame: false
	})

	win.loadURL(`file://${__dirname}/ongaku/index.html`)
	win.on('closed', onClosed)

	win.on('ready-to-show', () => {
		return win
	});
}

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
	mainWindow = createMainWindow()
})