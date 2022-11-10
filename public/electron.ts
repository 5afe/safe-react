import detect from 'detect-port'
import { app, BrowserWindow, Menu, nativeImage, session, shell, screen } from 'electron'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'
import express from 'express'
import fs from 'fs'
import https from 'https'
import path from 'path'

const DEFAULT_PORT = 5000
const trezorRegExp = new RegExp(`/https:\/\/((.+\.)*trezor\.io)/gi`)
const portisRegExp = new RegExp(`/https:\/\/((.+\.)*portis\.io)/gi`)

const isDev = process.env.ELECTRON_ENV === 'development'
const options = {
  key: fs.readFileSync(path.join(__dirname, './ssl/server.key')),
  cert: fs.readFileSync(path.join(__dirname, './ssl/server.crt')),
  ca: fs.readFileSync(path.join(__dirname, './ssl/rootCA.crt')),
}

let mainWindow

const getFreePort = async (): Promise<number> => {
  const port = await detect(DEFAULT_PORT)

  return port
}

const createServer = (port: number): void => {
  const app = express()
  app.disable('x-powered-by')
  const staticRoute = path.join(__dirname, '../build')

  // We define same route as in package.json -> homepage
  // If no homepage is defined we can totally remove that parameter
  app.use('/app', express.static(staticRoute))
  https.createServer(options, app).listen(port, '127.0.0.1')
}

const getOpenedWindow = (url: string, options) => {
  const { width, height } = screen.getPrimaryDisplay().bounds

  // filter all requests to trezor-bridge and change origin to make it work
  const filter = {
    urls: ['http://127.0.0.1:21325/*'],
  }

  options.webPreferences.affinity = 'main-window'

  if (trezorRegExp.test(url)) {
    session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
      details.requestHeaders['Origin'] = 'https://connect.trezor.io'
      callback({ cancel: false, requestHeaders: details.requestHeaders })
    })
  }

  if (portisRegExp.test(url) || trezorRegExp.test(url) || url.includes('app.tor.us')) {
    const win = new BrowserWindow({
      width: 350,
      height: 700,
      x: width - 1300,
      parent: mainWindow,
      y: height - (process.platform === 'win32' ? 750 : 200),
      fullscreen: false,
      show: false,
    })

    win.webContents.on('new-window', (event, url) => {
      if (trezorRegExp.test(url) && url.includes('bridge')) {
        shell.openExternal(url)
      }
    })

    win.once('ready-to-show', () => win.show())

    if (!options.webPreferences) {
      win.loadURL(url)
    }

    return win
  }

  return null
}

const createWindow = (port = DEFAULT_PORT) => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1366,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, '../scripts/preload.js'),
      // experimentalFeatures not needed now unless migrating to WebHID Electron >= 16
      // experimentalFeatures: true,
      nodeIntegration: true,
      // Needed to load Ledger from preload scripts, sharing context with main window
      contextIsolation: false,
      nativeWindowOpen: true, // need to be set in order to display modal. Not needed for Electron >= 15
    },
    icon: nativeImage.createFromPath(path.join(__dirname, '../build/resources/desktop-icon.png')),
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

  mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options) => {
    const win = getOpenedWindow(url, options)
    if (win) {
      win.once('ready-to-show', () => win.show())

      if (!options.webPreferences) {
        win.loadURL(url)
      }

      event.newGuest = win
    }
    // else shell.openExternal(url)
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

process.on('uncaughtException', (error) => {
  log.error(error)
})

// Can be removed once we get to electron >= 16 and ledger hid >= 6.28
app.allowRendererProcessReuse = false

app.userAgentFallback =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) old-airport-include/1.0.0 Chrome Electron/13.6.9'

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
