const electron = require("electron");
const  express = require('express');
const open = require('open');
const fs = require('fs');
const dialog = electron.dialog;
const https = require('https');
const autoUpdater = require('./auto-updater');

const url = require('url');
const app = electron.app;
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

function createWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, '../scripts/preload.js'),
      nodeIntegration: true,
      allowRunningInsecureContent: true
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

  // Hide the menu
  mainWindow.setMenu(null);
  mainWindow.setMenuBarVisibility(false)

  mainWindow.webContents.on('new-window', function(event, url){
    event.preventDefault();
    open(url);
  });

  mainWindow.webContents.on('did-finish-load', () => {
    autoUpdater.init(mainWindow);
  });

  mainWindow.on("closed", () => (mainWindow = null));
}

app.commandLine.appendSwitch('ignore-certificate-errors');
app.on("ready", () =>{
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