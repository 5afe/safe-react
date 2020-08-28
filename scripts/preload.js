// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const TransportNodeHid = require("@ledgerhq/hw-transport-node-hid").default;
const log = require('electron-log');
const isDev = require("electron-is-dev");
window.TransportNodeHid = TransportNodeHid;

window.isDesktop = true;

window.addEventListener('DOMContentLoaded', () => {
  const origLog = console.log
  const origError = console.error
  const origWarn = console.warn
  if(!isDev){
    console.error = (...args) => {
      origError(...args)
      log.error(...args)
    }
    console.warn = (...args) => {
      origWarn(...args)
      log.warn(...args)
    }
    console.log = (...args) => {
      origLog(...args)
      log.info(...args)
    }
  }
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})