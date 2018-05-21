// @flow
import { List, Map } from 'immutable'
import { type Owner, makeOwner } from '~/routes/safe/store/model/owner'
import { load, TX_KEY } from '~/utils/localStorage'
import { type Confirmation, type ConfirmationProps, makeConfirmation } from '~/routes/safe/store/model/confirmation'
import { makeTransaction, type Transaction, type TransactionProps } from '~/routes/safe/store/model/transaction'

const buildConfirmationsFrom = (owners: List<Owner>, creator: string): List<Confirmation> => {
  if (!owners) {
    throw new Error('This safe has no owners')
  }

  if (!owners.find((owner: Owner) => owner.get('address') === creator)) {
    throw new Error('The creator of the tx is not an owner')
  }

  return owners.map((owner: Owner) => makeConfirmation({ owner, status: owner.get('address') === creator }))
}

export const createTransaction = (
  name: string,
  nonce: number,
  destination: string,
  value: number,
  creator: string,
  owners: List<Owner>,
  tx: string,
  safeName: string,
  safeAddress: string,
  safeThreshold: number,
) => {
  const confirmations: List<Confirmation> = buildConfirmationsFrom(owners, creator)

  const notMinedWhenOneOwnerSafe = owners.count() === 1 && !tx
  if (notMinedWhenOneOwnerSafe) {
    throw new Error('The tx should be mined before storing it in safes with one owner')
  }

  const transaction: Transaction = makeTransaction({
    name, nonce, value, confirmations, destination, threshold: safeThreshold, tx,
  })

  const safeTransactions = load(TX_KEY) || {}
  const transactions = safeTransactions[safeAddress]
  const txsRecord = transactions ? List(transactions) : List([])

  if (txsRecord.find((txs: TransactionProps) => txs.nonce === nonce)) {
    throw new Error(`Transaction with same nonce: ${nonce} already created for safe: ${safeAddress}`)
  }

  safeTransactions[safeAddress] = txsRecord.push(transaction)

  localStorage.setItem(TX_KEY, JSON.stringify(safeTransactions))
}

export const loadSafeTransactions = () => {
  const safes = load(TX_KEY) || {}

  return Map().withMutations((map: Map<string, List<Confirmation>>) =>
    Object.keys(safes).map((safe: string) => {
      const safeTxs = safes[safe]
      const safeTxsRecord = safeTxs.map((tx: TransactionProps) => {
        const { confirmations } = tx
        const txRecord = makeTransaction({
          ...tx,
          confirmations: List(confirmations.map((conf: ConfirmationProps) =>
            makeConfirmation({ ...conf, owner: makeOwner(conf.owner) }))),
        })

        return txRecord
      })

      return map.set(safe, List(safeTxsRecord))
    }))
}
