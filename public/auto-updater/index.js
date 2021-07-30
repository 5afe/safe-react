"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var electron_settings_1 = __importDefault(require("electron-settings"));
var electron_log_1 = __importDefault(require("electron-log"));
var electron_updater_1 = require("electron-updater");
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------
electron_updater_1.autoUpdater.autoDownload = false;
electron_updater_1.autoUpdater.logger = electron_log_1.default;
electron_log_1.default.info('App starting...');
var initialized = false;
var downloadProgress = 0;
function init() {
    if (initialized)
        return;
    initialized = true;
    electron_updater_1.autoUpdater.on('error', function (error) {
        electron_log_1.default.error(error == null ? 'unknown' : (error.stack || error).toString());
    });
    electron_updater_1.autoUpdater.on('update-available', function (info) {
        if (info.version === electron_settings_1.default.get('release.version')) {
            electron_log_1.default.info("Skipped version " + info.version);
            return;
        }
        electron_1.dialog
            .showMessageBox({
            type: 'info',
            title: 'Found Updates',
            message: 'There is a newer version of this app available. Do you want to update now?',
            detail: info.releaseNotes.replace(/(<([^>]+)>)/g, ''),
            buttons: ['Install Update', 'Remind me later', 'Skip this version'],
            cancelId: 1,
        })
            .then(function (result) {
            if (result.response === 0) {
                electron_updater_1.autoUpdater.downloadUpdate();
            }
            if (result.response === 2) {
                electron_settings_1.default.set('release', { version: info.version });
            }
        });
        electron_updater_1.autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName) {
            var _a;
            (_a = electron_updater_1.autoUpdater.logger) === null || _a === void 0 ? void 0 : _a.info('Update Downloaded...');
            electron_1.dialog
                .showMessageBox({
                title: 'Install Updates',
                message: releaseName,
                detail: 'A new version has been downloaded. Restart the application to apply the updates.',
                buttons: ['Restart', 'Cancel'],
                cancelId: 1,
            })
                .then(function (result) {
                if (result.response === 0) {
                    electron_updater_1.autoUpdater.quitAndInstall();
                }
            });
        });
    });
    electron_updater_1.autoUpdater.on('download-progress', function (d) {
        var _a;
        downloadProgress = d.percent;
        (_a = electron_updater_1.autoUpdater.logger) === null || _a === void 0 ? void 0 : _a.info(downloadProgress);
    });
    electron_updater_1.autoUpdater.checkForUpdates();
}
module.exports = {
    init: init,
};
