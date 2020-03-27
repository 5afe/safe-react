const electron = require("electron");
const  express = require('express');
const fs = require('fs');
const https = require('https');

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

require("update-electron-app")({
  repo: "gnosis/safe-react",
  updateInterval: "1 hour"
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, '../scripts/preload.js'),
      nodeIntegration: true,
      allowRunningInsecureContent: true
    },
    icon: path.join(__dirname, './build/safe.png'),
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `https://localhost:${PORT}`
      )

  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
  }

  mainWindow.webContents.openDevTools();


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