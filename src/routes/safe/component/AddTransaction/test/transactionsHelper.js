// @flow
import { List, Map } from 'immutable'
import { type Confirmation } from '~/routes/safe/store/model/confirmation'
import { type Transaction } from '~/routes/safe/store/model/transaction'
import { type Owner } from '~/routes/safe/store/model/owner'

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
  safeTxs: List<Transaction> | typeof undefined, pos: number, name: string,
  nonce: number, value: number, threshold: number, destination: string,
  creator: string, txHash: string,
  firstOwner: Owner | typeof undefined, secondOwner: Owner | typeof undefined,
) => {
  if (!safeTxs) { throw new Error() }
  const tx: Transaction | typeof undefined = safeTxs.get(pos)

  if (!tx) { throw new Error() }
  expect(tx.get('name')).toBe(name)
  expect(tx.get('value')).toBe(value)
  expect(tx.get('threshold')).toBe(threshold)
  expect(tx.get('destination')).toBe(destination)
  expect(tx.get('confirmations').count()).toBe(2)
  expect(tx.get('nonce')).toBe(nonce)

  const confirmations: List<Confirmation> = tx.get('confirmations')
  const firstConfirmation: Confirmation | typeof undefined = confirmations.get(0)
  if (!firstConfirmation) { throw new Error() }
  expect(firstConfirmation.get('owner')).not.toBe(undefined)
  expect(firstConfirmation.get('owner')).toEqual(firstOwner)
  expect(firstConfirmation.get('status')).toBe(true)
  expect(firstConfirmation.get('hash')).toBe(txHash)

  const secondConfirmation: Confirmation | typeof undefined = confirmations.get(1)
  if (!secondConfirmation) { throw new Error() }
  expect(secondConfirmation.get('owner')).not.toBe(undefined)
  expect(secondConfirmation.get('owner')).toEqual(secondOwner)
  expect(secondConfirmation.get('status')).toBe(false)
}
