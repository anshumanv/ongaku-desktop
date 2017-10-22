const path = require('path')
const electron = require('electron')

const {app, Menu, Tray} = electron

function createTray (onToggle, onClose) {
	var imageFolder = path.join(__dirname, '../assets/icons/tray')
	var trayImage

	if(process.platform == 'win32') {
		trayImage = path.join(imageFolder, 'win', 'icon.ico')
	} else if(process.platform == 'darwin') {
		trayImage = path.join(imageFolder, 'osx', 'iconTemplate.png')
	} else {
		trayImage = path.join(imageFolder, 'png', 'icon.png')
	}

	trayIcon = new Tray(trayImage)
	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Toggle Show/Hide',
			click: onToggle
		},
		{
			label: 'Quit',
			click: onClose
		}
	])
	trayIcon.on('click', onToggle)

	trayIcon.setTitle('Ongaku')
	trayIcon.setToolTip('Ongaku')
	trayIcon.setContextMenu(contextMenu)

	return trayIcon
}

exports.create = createTray
