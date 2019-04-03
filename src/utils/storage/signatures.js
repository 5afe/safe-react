// @flow
import { Map } from 'immutable'
import { loadFromStorage } from '~/utils/storage'

const getSignaturesKeyFrom = (safeAddress: string) => `TXS-SIGNATURES-${safeAddress}`

export const storeSignature = async (safeAddress: string, nonce: number, signature: string) => {
  const signaturesKey = getSignaturesKeyFrom(safeAddress)
  const subjects = Map(await loadFromStorage(signaturesKey)) || Map()

  try {
    const key = `${nonce}`
    const existingSignatures = subjects.get(key)
    const signatures = existingSignatures ? existingSignatures + signature : signature
    const updatedSubjects = subjects.set(key, signatures)
    const serializedState = JSON.stringify(updatedSubjects)
    localStorage.setItem(signaturesKey, serializedState)
  } catch (err) {
    // eslint-disable-next-line
    console.log('Error storing signatures in localstorage')
  }
}

export const getSignaturesFrom = (safeAddress: string, nonce: number) => {
  const key = getSignaturesKeyFrom(safeAddress)
  const data: any = loadFromStorage(key)

  const signatures = data ? Map(data) : Map()
  const txSigs = signatures.get(String(nonce)) || ''

  return `0x${txSigs}`
}
