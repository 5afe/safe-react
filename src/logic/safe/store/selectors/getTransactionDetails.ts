import get from 'lodash.get'
import { createSelector } from 'reselect'

import { StoreStructure, Transaction, TxLocation, TxQueuedLocation } from 'src/logic/safe/store/models/types/gateway.d'
import { GATEWAY_TRANSACTIONS_ID } from 'src/logic/safe/store/reducer/gatewayTransactions'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { AppReduxState } from 'src/store'
import { sameString } from 'src/utils/strings'
import { createDeepEqualSelector, createDeeplyDeepEqualSelector } from './utils'

const getTransactions = (state: AppReduxState): AppReduxState['gatewayTransactions'] => state[GATEWAY_TRANSACTIONS_ID]

const getSafeTransactions = createSelector(
  getTransactions,
  safeParamAddressFromStateSelector,
  (transactionsBySafe, safeAddress) => transactionsBySafe[safeAddress],
)

export const getTransactionById = createDeepEqualSelector(
  getSafeTransactions,
  (_, transactionId: Transaction['id'], txLocation: TxLocation) => ({
    transactionId,
    txLocation,
  }),
  (transactions, { transactionId, txLocation }): Transaction | undefined => {
    if (transactions && transactionId) {
      for (const [, txs] of Object.entries(
        get(transactions, txLocation) as StoreStructure['history'] | StoreStructure['queued']['next' | 'queued'],
      )) {
        const foundTx = txs.find(({ id }) => sameString(id, transactionId))

        if (foundTx) {
          return foundTx
        }
      }
    }
  },
)

export const getTransactionDetails = createDeepEqualSelector(
  getSafeTransactions,
  (_, transactionId: Transaction['id'], txLocation: TxLocation) => ({
    transactionId,
    txLocation,
  }),
  (transactions, { transactionId, txLocation }): Transaction['txDetails'] | undefined => {
    if (transactions && transactionId) {
      for (const [, txs] of Object.entries(
        get(transactions, txLocation) as StoreStructure['history'] | StoreStructure['queued']['next' | 'queued'],
      )) {
        const txDetails = txs.find(({ id }) => sameString(id, transactionId))?.txDetails

        if (txDetails) {
          return txDetails
        }
      }
    }
  },
)

export const getQueuedTransactionsByNonceAndLocation = createDeeplyDeepEqualSelector(
  getSafeTransactions,
  (_, nonce: number, txLocation: TxQueuedLocation) => ({ nonce, txLocation }),
  (transactions, { nonce, txLocation }): Transaction[] => {
    const transactionsByLocation = get(transactions, txLocation)

    if (transactionsByLocation) {
      return transactionsByLocation[nonce] ?? []
    }

    return []
  },
)
