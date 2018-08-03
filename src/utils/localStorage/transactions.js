// @flow
import { Map } from 'immutable'
import { load } from '~/utils/localStorage'

const getSubjectKeyFrom = (safeAddress: string) => `TXS-SUBJECTS-${safeAddress}`

export const storeSubject = (safeAddress: string, nonce: number, subject: string) => {
  const key = getSubjectKeyFrom(safeAddress)
  const subjects = load(key) || Map()

  try {
    const updatedSubjects = subjects.setIn([safeAddress, String(nonce)], subject)
    const serializedState = JSON.stringify(updatedSubjects)
    localStorage.setItem(key, serializedState)
  } catch (err) {
    // eslint-disable-next-line
    console.log('Error storing transaction subject in localstorage')
  }
}
