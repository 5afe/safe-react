// @flow
import { Map } from 'immutable'
import { loadFromStorage, saveToStorage } from '~/utils/storage'

const getSignaturesKeyFrom = (safeAddress: string) => `TXS-SIGNATURES-${safeAddress}`

export const storeSignature = async (safeAddress: string, nonce: number, signature: string) => {
  const signaturesKey = getSignaturesKeyFrom(safeAddress)
  const subjects = Map(await loadFromStorage(signaturesKey)) || Map()

  try {
    const key = `${nonce}`
    const existingSignatures = subjects.get(key)
    const signatures = existingSignatures ? existingSignatures + signature : signature
    const updatedSubjects = subjects.set(key, signatures)
    await saveToStorage(signaturesKey, updatedSubjects)
  } catch (err) {
    console.error('Error storing signatures in localstorage', err)
  }
}

export const getSignaturesFrom = (safeAddress: string, nonce: number) => {
  const key = getSignaturesKeyFrom(safeAddress)
  const data: any = loadFromStorage(key)

  const signatures = data ? Map(data) : Map()
  const txSigs = signatures.get(String(nonce)) || ''

  return `0x${txSigs}`
}
