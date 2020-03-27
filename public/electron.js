const electron = require("electron");
const  express = require('express');

const url = require('url');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");

const PORT = 3333;

const createServer = () => {
  const server = express();
  const staticRoute = path.join(__dirname, '../build_webpack');
  server.use(express.static(staticRoute));
  server.listen(PORT);
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
      nodeIntegration: false,
      webSecurity:true
    },
    icon: path.join(__dirname, './build/safe.png'),
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `http://localhost:${PORT}`
      )

  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => (mainWindow = null));
}

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