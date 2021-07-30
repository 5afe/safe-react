// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// https://stackoverflow.com/a/58164407/7820085
const {
  remote: { app },
} = require('electron')
const log = require('electron-log')
const USB = require('webusb').usb

const isDev = !app.isPackaged
window.isDesktop = true
global.navigator.usb.__proto__ = USB

window.addEventListener('DOMContentLoaded', () => {
  const origLog = console.log
  const origError = console.error
  const origWarn = console.warn
  if (!isDev) {
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
