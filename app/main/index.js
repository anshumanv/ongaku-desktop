#!/usr/bin/env electron

const path = require('path')
const electron = require('electron')

const {app, BrowserWindow, globalShortcut, webContents} = electron

// Adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')()

// Prevent window being garbage collected
let mainWindow

const mainURL = 'file://' + path.join(__dirname, '../renderer', 'index.html');

function onClosed () {
	// Dereference the window
	// For multiple windows store them in an array
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

	const page = mainWindow.webContents

	page.on('dom-ready', () => {
		mainWindow.show()
	})
})
