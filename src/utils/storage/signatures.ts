import { Map } from 'immutable'

import { loadFromStorage, saveToStorage } from 'src/utils/storage'

const getSignaturesKeyFrom = (safeAddress) => `TXS-SIGNATURES-${safeAddress}`

export const storeSignature = async (safeAddress, nonce, signature) => {
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

export const getSignaturesFrom = (safeAddress, nonce) => {
  const key = getSignaturesKeyFrom(safeAddress)
  const data = loadFromStorage(key)

  const signatures = data ? Map(data as any) : Map()
  const txSigs = signatures.get(String(nonce)) || ''

  return `0x${txSigs}`
}
