const path = require('path')
const { app, Menu, Tray, ipcMain } = require('electron')
const { preferences } = require('../constants')

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

	const execWV = code => (
		mainWindow.webContents.executeJavaScript(`
			webview = document.querySelector('webview');
			webview.executeJavaScript(\`${code}\`);
		`)
	)

	const musicFN = code => execWV(`
		mus = document.querySelector('#music');
		${code}
	`)

	const togglePRF = prf => execWV(`
		$('input.cb-${prf}').click()
	`)

	const contextMenu = [
		{
			label: 'Toggle Show/Hide',
			click: onToggle
		},
		{
			label: 'Preferences',
			id: 'prf',
			enabled: false,
			submenu: []
		},
		{
			type: 'separator'
		},
		{
			label: 'Play/Pause',
			click() {
				musicFN(`
					if (mus.paused) {
						mus.play();
					} else {
						mus.pause();
					}
				`)
			}
		},
		{
			label: 'Restart',
			click() {
				musicFN(`
					mus.currentTime = 0;
					if (mus.paused) {
						mus.play();
					}
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

	trayIcon.setContextMenu(Menu.buildFromTemplate(contextMenu))
	ipcMain.once('loaded', (e, msg) => {
		contextMenu.forEach((item, index) => {
			if (item.id === 'prf') {
				contextMenu[index].enabled = true

				preferences.forEach((prf) => {
					contextMenu[index].submenu.push({
						label: prf.name,
						id: prf.id,
						type: 'checkbox',
						checked: true,
						click() {
							togglePRF(prf.id)
						}
					})

					ipcMain.on(prf.id, (e, msg) => {
						contextMenu[index].submenu.forEach((item, idx) => {
							if (item.id === prf.id) {
								contextMenu[index].submenu[idx].checked = msg
							}
						})

						trayIcon.setContextMenu(Menu.buildFromTemplate(contextMenu))
					})
				})
			}
		})

		trayIcon.setContextMenu(Menu.buildFromTemplate(contextMenu))
	})

	trayIcon.setToolTip('Loading...')
	ipcMain.on('songName', (e, msg) => {
		trayIcon.setToolTip(msg)
	})

	return trayIcon
}

exports.create = createTray
