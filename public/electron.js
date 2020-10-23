const electron = require('electron')
const express = require('express')
const log = require('electron-log')
const fs = require('fs')
const Menu = electron.Menu
const https = require('https')
const detect = require('detect-port')
const autoUpdater = require('./auto-updater')

const { app, session, BrowserWindow, shell } = electron

const path = require('path')
const isDev = require('electron-is-dev')

const options = {
  key: fs.readFileSync(path.join(__dirname, './ssl/server.key')),
  cert: fs.readFileSync(path.join(__dirname, './ssl/server.crt')),
  ca: fs.readFileSync(path.join(__dirname, './ssl/rootCA.crt')),
}

const DEFAULT_PORT = 5000

const createServer = async () => {
  const app = express()
  const staticRoute = path.join(__dirname, '../build')
  app.use(express.static(staticRoute))
  let selectedPort = DEFAULT_PORT
  try {
    const _port = await detect(DEFAULT_PORT)
    if (_port !== DEFAULT_PORT) selectedPort = _port
    https.createServer(options, app).listen(selectedPort)
  } catch (e) {
    log.error(e)
  } finally {
    return selectedPort
  }
}

let mainWindow

function getOpenedWindow(url, options) {
  let display = electron.screen.getPrimaryDisplay()
  let width = display.bounds.width
  let height = display.bounds.height

  // filter all requests to trezor-bridge and change origin to make it work
  const filter = {
    urls: ['http://127.0.0.1:21325/*'],
  }

  options.webPreferences.affinity = 'main-window'

  if (url.includes('trezor')) {
    session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
      details.requestHeaders['Origin'] = 'https://connect.trezor.io'
      callback({ cancel: false, requestHeaders: details.requestHeaders })
    })
  }

  if (url.includes('wallet.portis') || url.includes('trezor') || url.includes('app.tor.us')) {
    const win = new BrowserWindow({
      width: 350,
      height: 700,
      x: width - 1300,
      parent: mainWindow,
      y: height - (process.platform === 'win32' ? 750 : 200),
      webContents: options.webContents, // use existing webContents if provided
      fullscreen: false,
      show: false,
    })
    win.webContents.on('new-window', function (event, url) {
      if (url.includes('trezor') && url.includes('bridge')) shell.openExternal(url)
    })
    win.once('ready-to-show', () => win.show())

    if (!options.webPreferences) {
      win.loadURL(url)
    }
    return win
  }

  return null
}

function createWindow(port = DEFAULT_PORT) {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, '../scripts/preload.js'),
      allowRunningInsecureContent: true,
      nativeWindowOpen: true, // need to be set in order to display modal
    },
    icon: electron.nativeImage.createFromPath(path.join(__dirname, './build/safe.png')),
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `https://localhost:${port}`)

  if (isDev) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools()
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
  }

  mainWindow.setMenu(null)
  mainWindow.setMenuBarVisibility(false)

  mainWindow.webContents.on('new-window', function (event, url, frameName, disposition, options) {
    event.preventDefault()
    const win = getOpenedWindow(url, options)
    if (win) {
      win.once('ready-to-show', () => win.show())

      if (!options.webPreferences) {
        win.loadURL(url)
      }

      event.newGuest = win
    } else shell.openExternal(url)
  })

  mainWindow.webContents.on('did-finish-load', () => {
    autoUpdater.init(mainWindow)
  })

  mainWindow.webContents.on('crashed', (event) => {
    log.info(`App Crashed: ${event}`)
    mainWindow.reload()
  })

  mainWindow.on('closed', () => (mainWindow = null))
}

process.on('uncaughtException', function (error) {
  log.error(error)
})

app.userAgentFallback =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) old-airport-include/1.0.0 Chrome Electron/7.1.7 Safari/537.36'

// We have one non-context-aware module in node_modules/usb. This is used by @ledgerhq/hw-transport-node-hid
// This type of modules will be impossible to use after electron 10
app.allowRendererProcessReuse = false

app.commandLine.appendSwitch('ignore-certificate-errors')
app.on('ready', async () => {
  // Hide the menu
  Menu.setApplicationMenu(null)
  let usedPort = DEFAULT_PORT
  if (!isDev) usedPort = await createServer()
  createWindow(usedPort)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
