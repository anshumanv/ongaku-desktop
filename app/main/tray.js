const path = require('path')
const electron = require('electron')

const { app, Menu, Tray } = electron

function createTray (onToggle, onClose, mainWindow) {
	const imageFolder = path.join(__dirname, '../assets/icons/tray')
	let trayImage
	if (process.platform == 'win32') {
		trayImage = path.join(imageFolder, 'win', 'icon.ico')
	} else if (process.platform == 'darwin') {
		trayImage = path.join(imageFolder, 'osx', 'iconTemplate.png')
	} else {
		trayImage = path.join(imageFolder, 'png', 'icon.png')
	}

	const contextMenu = [
		{
			label: 'Toggle Show/Hide',
			click: onToggle
		},
		{
			type: 'separator'
		},
		{
			label: 'Play/Pause',
			click() {
				mainWindow.webContents.executeJavaScript(`
					webview = document.querySelector('webview');
					webview.executeJavaScript(\`
						mus = document.querySelector('#music');
						if (mus.paused) {
							mus.play();
						} else {
							mus.pause();
						}
					\`)
				`)
			}
		},
		{
			type: 'separator'
		},
		{
			label: 'Quit',
			click: onClose
		}
	]

	const trayIcon = new Tray(trayImage)

	trayIcon.on('click', onToggle)

	trayIcon.setTitle('Ongaku')
	trayIcon.setToolTip('Ongaku')
	trayIcon.setContextMenu(Menu.buildFromTemplate(contextMenu))

	return trayIcon
}

exports.create = createTray
