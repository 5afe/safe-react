// @flow
import { Map } from 'immutable'
import { loadFromStorage, saveToStorage } from '~/utils/storage'

const getSubjectKeyFrom = (safeAddress: string) => `TXS-SUBJECTS-${safeAddress}`

export const storeSubject = async (safeAddress: string, nonce: number, subject: string) => {
  const key = getSubjectKeyFrom(safeAddress)
  const subjects = Map(await loadFromStorage(key)) || Map()

  try {
    const updatedSubjects = subjects.set(nonce, subject)
    saveToStorage(key, updatedSubjects)
  } catch (err) {
    console.error('Error storing transaction subject in localstorage', err)
  }
}
