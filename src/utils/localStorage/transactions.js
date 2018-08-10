// @flow
import { Map } from 'immutable'
import { load } from '~/utils/localStorage'

const getSubjectKeyFrom = (safeAddress: string) => `TXS-SUBJECTS-${safeAddress}`

export const storeSubject = (safeAddress: string, nonce: number, subject: string) => {
  const key = getSubjectKeyFrom(safeAddress)
  const subjects = Map(load(key)) || Map()

  try {
    const updatedSubjects = subjects.set(nonce, subject)
    const serializedState = JSON.stringify(updatedSubjects)
    localStorage.setItem(key, serializedState)
  } catch (err) {
    // eslint-disable-next-line
    console.log('Error storing transaction subject in localstorage')
  }
}

export const loadSafeSubjects = (safeAddress: string): Map<string, string> => {
  const key = getSubjectKeyFrom(safeAddress)
  const data: any = load(key)

  return data ? Map(data) : Map()
}
