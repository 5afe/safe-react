import express from 'express'
import log from 'electron-log'
import fs from 'fs'
import electron from 'electron'
import https from 'https'
import { autoUpdater } from 'electron-updater'
import detect from 'detect-port'
import path from 'path'

const { app, session, BrowserWindow, shell, Menu } = electron
const isDev = !app.isPackaged
const DEFAULT_PORT = 5000
app.allowRendererProcessReuse = false
const options = {
  key: fs.readFileSync(path.join(__dirname, './ssl/server.key')),
  cert: fs.readFileSync(path.join(__dirname, './ssl/server.crt')),
  ca: fs.readFileSync(path.join(__dirname, './ssl/rootCA.crt')),
}

async function getFreePort(): Promise<number> {
  const port = await detect(DEFAULT_PORT)

  return port
}

function createServer(port: number): void {
  const app = express()
  const staticRoute = path.join(__dirname, '../build')

  // We define same route as in package.json -> homepage
  // If no homepage is defined we can totally remove that parameter
  app.use('/app', express.static(staticRoute))
  https.createServer(options, app).listen(port, '127.0.0.1')
}

let mainWindow

function getOpenedWindow(url: string, options) {
  const display = electron.screen.getPrimaryDisplay()
  const width = display.bounds.width
  const height = display.bounds.height

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
    width: 1366,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, '../scripts/preload.js'),
      experimentalFeatures: true,
      enableRemoteModule: true,
      contextIsolation: false,
      nativeWindowOpen: true, // need to be set in order to display modal
    },
    icon: electron.nativeImage.createFromPath(path.join(__dirname, '../build/resources/safe.png')),
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // We define same route as in package.json -> homepage
  // If no homepage is defined we can totally remove /app
  mainWindow.loadURL(isDev ? 'http://localhost:3000/app' : `https://localhost:${port}/app`)

  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools()
  }

  mainWindow.setMenu(null)
  mainWindow.setMenuBarVisibility(false)

  mainWindow.webContents.on('new-window', function (event, url, frameName, disposition, options) {
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
    autoUpdater.checkForUpdatesAndNotify()
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
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) old-airport-include/1.0.0 Chrome Electron/13.5.2 Safari/537.36'

app.whenReady().then(async () => {
  // Hide the menu
  Menu.setApplicationMenu(null)

  const port = await getFreePort()

  if (!isDev) {
    // Allow self-signed certificates only for the Electron-created localhost server
    app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
      const parsedUrl = new URL(url)
      if (parsedUrl.origin === `https://localhost:${port}`) {
        event.preventDefault()
        callback(true)
      } else {
        callback(false)
      }
    })

    createServer(port)
  }

  createWindow(port)
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
