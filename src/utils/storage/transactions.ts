import { Map } from 'immutable'

import { loadFromStorage, saveToStorage } from 'src/utils/storage'

const getSubjectKeyFrom = (safeAddress) => `TXS-SUBJECTS-${safeAddress}`

export const storeSubject = async (safeAddress, nonce, subject) => {
  const key = getSubjectKeyFrom(safeAddress)
  const subjects = Map(await loadFromStorage(key)) || Map()

  try {
    const updatedSubjects = subjects.set(nonce, subject)
    saveToStorage(key, updatedSubjects)
  } catch (err) {
    console.error('Error storing transaction subject in localstorage', err)
  }
}
