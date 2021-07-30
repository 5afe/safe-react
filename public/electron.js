"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var electron_log_1 = __importDefault(require("electron-log"));
var fs_1 = __importDefault(require("fs"));
var electron_1 = __importDefault(require("electron"));
var https_1 = __importDefault(require("https"));
var electron_updater_1 = require("electron-updater");
var detect_port_1 = __importDefault(require("detect-port"));
var path_1 = __importDefault(require("path"));
var app = electron_1.default.app, session = electron_1.default.session, BrowserWindow = electron_1.default.BrowserWindow, shell = electron_1.default.shell, Menu = electron_1.default.Menu;
var isDev = !app.isPackaged;
var DEFAULT_PORT = 5000;
var options = {
    key: fs_1.default.readFileSync(path_1.default.join(__dirname, './ssl/server.key')),
    cert: fs_1.default.readFileSync(path_1.default.join(__dirname, './ssl/server.crt')),
    ca: fs_1.default.readFileSync(path_1.default.join(__dirname, './ssl/rootCA.crt')),
};
function getFreePort() {
    return __awaiter(this, void 0, void 0, function () {
        var port;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, detect_port_1.default(DEFAULT_PORT)];
                case 1:
                    port = _a.sent();
                    return [2 /*return*/, port];
            }
        });
    });
}
function createServer(port) {
    var app = express_1.default();
    var staticRoute = path_1.default.join(__dirname, '../build');
    app.use(express_1.default.static(staticRoute));
    https_1.default.createServer(options, app).listen(port);
}
var mainWindow;
function getOpenedWindow(url, options) {
    var display = electron_1.default.screen.getPrimaryDisplay();
    var width = display.bounds.width;
    var height = display.bounds.height;
    // filter all requests to trezor-bridge and change origin to make it work
    var filter = {
        urls: ['http://127.0.0.1:21325/*'],
    };
    options.webPreferences.affinity = 'main-window';
    if (url.includes('trezor')) {
        session.defaultSession.webRequest.onBeforeSendHeaders(filter, function (details, callback) {
            details.requestHeaders['Origin'] = 'https://connect.trezor.io';
            callback({ cancel: false, requestHeaders: details.requestHeaders });
        });
    }
    if (url.includes('wallet.portis') || url.includes('trezor') || url.includes('app.tor.us')) {
        var win_1 = new BrowserWindow({
            width: 350,
            height: 700,
            x: width - 1300,
            parent: mainWindow,
            y: height - (process.platform === 'win32' ? 750 : 200),
            fullscreen: false,
            show: false,
        });
        win_1.webContents.on('new-window', function (event, url) {
            if (url.includes('trezor') && url.includes('bridge'))
                shell.openExternal(url);
        });
        win_1.once('ready-to-show', function () { return win_1.show(); });
        if (!options.webPreferences) {
            win_1.loadURL(url);
        }
        return win_1;
    }
    return null;
}
function createWindow(port) {
    if (port === void 0) { port = DEFAULT_PORT; }
    mainWindow = new BrowserWindow({
        show: false,
        width: 1366,
        height: 768,
        webPreferences: {
            preload: path_1.default.join(__dirname, '../scripts/preload.js'),
            experimentalFeatures: true,
            enableRemoteModule: true,
            nativeWindowOpen: true, // need to be set in order to display modal
        },
        icon: electron_1.default.nativeImage.createFromPath(path_1.default.join(__dirname, '../build/resources/safe.png')),
    });
    mainWindow.once('ready-to-show', function () {
        mainWindow.show();
    });
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : "https://localhost:" + port);
    if (isDev) {
        // Open the DevTools.
        //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    }
    mainWindow.webContents.openDevTools();
    mainWindow.setMenu(null);
    mainWindow.setMenuBarVisibility(false);
    mainWindow.webContents.on('new-window', function (event, url, frameName, disposition, options) {
        event.preventDefault();
        var win = getOpenedWindow(url, options);
        if (win) {
            win.once('ready-to-show', function () { return win.show(); });
            if (!options.webPreferences) {
                win.loadURL(url);
            }
            event.newGuest = win;
        }
        else
            shell.openExternal(url);
    });
    mainWindow.webContents.on('did-finish-load', function () {
        electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
    });
    mainWindow.webContents.on('crashed', function (event) {
        electron_log_1.default.info("App Crashed: " + event);
        mainWindow.reload();
    });
    mainWindow.on('closed', function () { return (mainWindow = null); });
}
process.on('uncaughtException', function (error) {
    electron_log_1.default.error(error);
});
app.userAgentFallback =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) old-airport-include/1.0.0 Chrome Electron/11.3.0 Safari/537.36';
app.commandLine.appendSwitch('ignore-certificate-errors');
app.whenReady().then(function () { return __awaiter(void 0, void 0, void 0, function () {
    var port;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Hide the menu
                Menu.setApplicationMenu(null);
                return [4 /*yield*/, getFreePort()];
            case 1:
                port = _a.sent();
                if (!isDev) {
                    createServer(port);
                }
                createWindow(port);
                return [2 /*return*/];
        }
    });
}); });
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
