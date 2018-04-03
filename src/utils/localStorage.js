// @flow
const SAFES_KEY = 'SAFES'

export const loadSafes = () => {
  try {
    const serializedState = localStorage.getItem(SAFES_KEY)
    if (serializedState === null) {
      return undefined
    }

    if (serializedState === undefined) {
      return undefined
    }

    return JSON.parse(serializedState)
  } catch (err) {
    return undefined
  }
}

export const saveSafes = (safes: Object) => {
  try {
    const serializedState = JSON.stringify(safes)
    localStorage.setItem(SAFES_KEY, serializedState)
  } catch (err) {
    // Ignore write errors
  }
}
