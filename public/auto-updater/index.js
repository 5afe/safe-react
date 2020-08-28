const os = require('os');
const { dialog } = require('electron');
const log = require('electron-log');
const settings = require('electron-settings');

const { autoUpdater } = require("electron-updater");

// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------

autoUpdater.autoDownload = false
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let initialized = false;
let downloadProgress = 0;

function init(mainWindow) {

  if(initialized) return;

  initialized = true;

  autoUpdater.on('error', (error) => {
    log.error(error == null ? "unknown" : (error.stack || error).toString());
  });

  autoUpdater.on('update-available', (info) => {
    if(info.version === settings.get('release.version')) {
      log.info(`Skipped version ${info.version}`);
      return;
    }
    dialog.showMessageBox({
      type: 'info',
      title: 'Found Updates',
      message: 'There is a newer version of this app available. Do you want to update now?',
      detail: info.releaseNotes.replace(/(<([^>]+)>)/g, ""),
      buttons: ['Install Update', 'Remind me later','Skip this version'],
      cancelId:1,
    }).then(result => {
      if(result.response === 0){
        autoUpdater.downloadUpdate();
      }
      if(result.response === 2) {
        settings.set('release', {version: info.version });
      }
    });

    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
      autoUpdater.logger.info("Update Downloaded...");
      dialog.showMessageBox({
        title: 'Install Updates',
        message: releaseName,
        detail: 'A new version has been downloaded. Restart the application to apply the updates.',
        buttons: ['Restart', 'Cancel'],
        cancelId:1,
      }).then(result => {
        if(result.response === 0){
          autoUpdater.quitAndInstall();
        }
      });
    });
  });

  autoUpdater.on("download-progress", (d) => {
    downloadProgress = d.percent;
    autoUpdater.logger.info(downloadProgress);
  });

  autoUpdater.checkForUpdates();
}

module.exports = {
  init,
};
