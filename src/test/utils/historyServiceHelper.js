// @flow
import { List, Map } from 'immutable'
import { type Confirmation } from '~/routes/safe/store/model/confirmation'
import { type Transaction } from '~/routes/safe/store/model/transaction'

export const testSizeOfSafesWith = (transactions: Map<string, List<Transaction>>, size: number) => {
  expect(transactions).not.toBe(undefined)
  expect(transactions).not.toBe(null)
  expect(transactions.size).toBe(size)
}

export const testSizeOfTransactions = (safeTxs: List<Transaction> | typeof undefined, size: number) => {
  if (!safeTxs) { throw new Error() }
  expect(safeTxs.count()).toBe(size)
  expect(safeTxs.get(0)).not.toBe(undefined)
  expect(safeTxs.get(0)).not.toBe(null)
}

export const testTransactionFrom = (
  safeTxs: List<Transaction> | typeof undefined, pos: number,
  name: string, nonce: number, value: number, destination: string,
  data: string, isExecuted: boolean, confirmations: List<Confirmation>,
) => {
  if (!safeTxs) { throw new Error() }
  const tx: Transaction | typeof undefined = safeTxs.get(pos)

  if (!tx) { throw new Error() }
  expect(tx.get('name')).toBe(name)
  expect(tx.get('nonce')).toBe(nonce)
  expect(tx.get('value')).toBe(value)
  expect(tx.get('destination')).toBe(destination)
  expect(tx.get('data')).toBe(data)
  expect(tx.get('isExecuted')).toBe(isExecuted)
  expect(tx.get('confirmations')).toBe(confirmations)
}
