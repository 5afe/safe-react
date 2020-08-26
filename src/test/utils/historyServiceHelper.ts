// 
import { List, Map } from 'immutable'
import { } from 'src/logic/safe/store/models/confirmation'
import { } from 'src/logic/safe/store/models/transaction'
import { sameAddress } from 'src/logic/wallets/ethAddresses'

export const testSizeOfSafesWith = (transactions, size) => {
  expect(transactions).not.toBe(undefined)
  expect(transactions).not.toBe(null)
  expect(transactions.size).toBe(size)
}

export const testSizeOfTransactions = (safeTxs, size) => {
  if (!safeTxs) {
    throw new Error()
  }
  expect(safeTxs.count()).toBe(size)
  expect(safeTxs.get(0)).not.toBe(undefined)
  expect(safeTxs.get(0)).not.toBe(null)
}

export const testTransactionFrom = (
  safeTxs,
  pos,
  name,
  nonce,
  value,
  destination,
  data,
  isExecuted,
  confirmations,
) => {
  if (!safeTxs) {
    throw new Error()
  }
  const tx = safeTxs.get(pos)

  if (!tx) {
    throw new Error()
  }
  expect(tx.get('name')).toBe(name)
  expect(tx.get('nonce')).toBe(nonce)
  expect(tx.get('value')).toBe(value)
  expect(sameAddress(tx.get('destination'), destination)).toBe(true)
  expect(tx.get('data')).toBe(data)
  expect(tx.get('isExecuted')).toBe(isExecuted)
  expect(tx.get('confirmations')).toEqual(confirmations)
}
