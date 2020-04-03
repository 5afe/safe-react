const os = require('os');
const fetch = require('node-fetch');
const { dialog, app } = require('electron');
const log = require('electron-log');
const isDev = require("electron-is-dev");
const { autoUpdater } = require("electron-updater");

// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------

autoUpdater.autoDownload = false
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let initialized = false;

function init(mainWindow) {

  if(initialized || isDev) return;

  initialized = true;

  autoUpdater.on('error', (error) => {
    dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString());
  });

  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Found Updates',
      message: 'Found updates, do you want to update now?',
      buttons: ['Yes', 'Remind me later'],
      cancelId:1,
    }).then(result => {
      if(result.response === 0){
        autoUpdater.downloadUpdate();
      }
    });
  })

  autoUpdater.on('update-not-available', () => {
    dialog.showMessageBox({
      buttons: ["OK"],
      title: 'No Updates',
      message: 'Current version is up-to-date.'
    })
  });

  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    dialog.showMessageBox({
      title: 'Install Updates',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: 'A new version has been downloaded. Restart the application to apply the updates.',
      buttons: ['Restart', 'Cancel'],
      cancelId:1,
    }).then(result => {
      if(result.response === 0){
        autoUpdater.quitAndInstall();
      }
    });
  });

  autoUpdater.checkForUpdates()
}

module.exports = {
  init,
};
