const electron = require("electron");
const  express = require('express');
const open = require('open');
const fs = require('fs');
const dialog = electron.dialog;
const Menu = electron.Menu;
const https = require('https');
const autoUpdater = require('./auto-updater');

const url = require('url');
const app = electron.app;
const session = electron.session;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");

const options = {
  key:  fs.readFileSync(path.join(__dirname, './ssl/server.key')),
  cert: fs.readFileSync(path.join(__dirname, './ssl/server.crt')),
  ca:   fs.readFileSync(path.join(__dirname, './ssl/rootCA.crt'))
};

const PORT = 5000;

const createServer = () => {
  const app = express();
  const staticRoute = path.join(__dirname, '../build_webpack');
  app.use(express.static(staticRoute));
  https.createServer(options, app).listen(PORT);
}


let mainWindow;

function getOpenedWindow(url,options) {
  let display = electron.screen.getPrimaryDisplay();
  let width = display.bounds.width;
  let height = display.bounds.height;

  // filter all requests to trezor-bridge and change origin to make it work
   const filter = {
    urls: ['http://127.0.0.1:21325/*']
  };

  options.webPreferences.affinity = 'main-window';

  if(url.includes('about:blank')){
    /*
    session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
      details.requestHeaders['Origin'] = 'https://electron.trezor.io';
      callback({cancel: false, requestHeaders: details.requestHeaders});
    });
  }
 */
  if(url.includes('wallet.portis') || url.includes('about:blank')){
    const win = new BrowserWindow({
      width:300,
      height:700,
      x: width - 1300,
      parent:mainWindow,
      y: height - 200,
      webContents: options.webContents, // use existing webContents if provided
      fullscreen: false,
      show: false,
    });

    win.once('ready-to-show', () => win.show());

    if(!options.webPreferences){
      win.loadURL(url);
    }
    return win
  }

  return null;


}
function createWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, '../scripts/preload.js'),
      allowRunningInsecureContent: true,
      nodeIntegration: true, // dev settings to be able to use "require" in main.js, could be set to false in production build
      nativeWindowOpen: true, // need to be set in order to display modal
    },
    icon: path.join(__dirname, './build/safe.png'),
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `https://localhost:${PORT}`
      )

  if (isDev) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
  }

  mainWindow.setMenu(null);
  mainWindow.setMenuBarVisibility(false);

  mainWindow.webContents.on('new-window', function(event, url, frameName, disposition, options){
    event.preventDefault();
    const win = getOpenedWindow(url,options);
    if(win){
      win.once('ready-to-show', () => win.show());

      if(!options.webPreferences){
        win.loadURL(url);
      }

      event.newGuest = win
    } else open(url);
  });

  mainWindow.webContents.on('did-finish-load', () => {
    autoUpdater.init(mainWindow);
  });

  mainWindow.webContents.on('crashed', () => {
    mainWindow.destroy();
    createWindow();
  });

  mainWindow.on("closed", () => (mainWindow = null));
}

app.commandLine.appendSwitch('ignore-certificate-errors');
app.on("ready", () =>{
  // Hide the menu
  //Menu.setApplicationMenu(null);
  if(!isDev) createServer();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});