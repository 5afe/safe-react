import Storage from './Storage'

const session = new Storage(window.sessionStorage)

export default session

export const {
  getItem: loadFromSessionStorage,
  setItem: saveToSessionStorage,
  removeItem: removeFromSessionStorage,
} = session
