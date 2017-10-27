#!/usr/bin/env electron

const path = require('path')
const electron = require('electron')
const tray = require('./tray.js')

const {app, BrowserWindow, globalShortcut, webContents} = electron

// Prevent window and tray from being garbage collected
let mainWindow
let trayIcon
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
	trayIcon = null
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
	trayIcon = tray.create(onTrayToggle, onTrayClose, mainWindow)

	const page = mainWindow.webContents

	page.on('dom-ready', () => {
		mainWindow.show()
	})
})
