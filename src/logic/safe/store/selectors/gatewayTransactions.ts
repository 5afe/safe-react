import flatten from 'lodash/flatten'
import get from 'lodash/get'
import { createSelector } from 'reselect'

import {
  isMultisigExecutionInfo,
  StoreStructure,
  Transaction,
  TxLocation,
} from 'src/logic/safe/store/models/types/gateway.d'
import { GATEWAY_TRANSACTIONS_ID } from 'src/logic/safe/store/reducer/gatewayTransactions'
import { currentChainId } from 'src/logic/config/store/selectors'
import { createHashBasedSelector } from 'src/logic/safe/store/selectors/utils'
import { AppReduxState } from 'src/store'
import { extractSafeAddress } from 'src/routes/routes'

export const gatewayTransactions = (state: AppReduxState): AppReduxState['gatewayTransactions'] => {
  return state[GATEWAY_TRANSACTIONS_ID]
}

export const historyTransactions = createHashBasedSelector(
  gatewayTransactions,
  currentChainId,
  (gatewayTransactions, chainId): StoreStructure['history'] | undefined => {
    const safeAddress = extractSafeAddress()
    return chainId && safeAddress ? gatewayTransactions[chainId]?.[safeAddress]?.history : undefined
  },
)

export const pendingTransactions = createSelector(
  gatewayTransactions,
  currentChainId,
  (gatewayTransactions, chainId): StoreStructure['queued'] | undefined => {
    const safeAddress = extractSafeAddress()
    return chainId && safeAddress ? gatewayTransactions[chainId]?.[safeAddress]?.queued : undefined
  },
)

export const nextTransactions = createSelector(
  pendingTransactions,
  (pendingTransactions): StoreStructure['queued']['next'] | undefined => {
    return pendingTransactions?.next
  },
)

export const queuedTransactions = createSelector(
  pendingTransactions,
  (pendingTransactions): StoreStructure['queued']['queued'] | undefined => {
    return pendingTransactions?.queued
  },
)

const txLocations: TxLocation[] = ['queued.next', 'queued.queued', 'history']

export const getTransactionWithLocationByAttribute = createSelector(
  gatewayTransactions,
  currentChainId,
  extractSafeAddress,
  (
    _: AppReduxState,
    attrDetails: { attributeName: keyof Transaction; attributeValue: Transaction[keyof Transaction] },
  ) => attrDetails,
  (gatewayTransactions, chainId, safeAddress, attrDetails) => {
    const { attributeName, attributeValue } = attrDetails
    for (const txLocation of txLocations) {
      const storedTxs: StoreStructure['history'] | StoreStructure['queued']['queued' | 'next'] | undefined = get(
        gatewayTransactions?.[chainId]?.[safeAddress],
        txLocation,
      )

      if (!storedTxs) {
        continue
      }

      for (const txs of Object.values(storedTxs)) {
        // If we want a deep comparison, we should use a lodash get/isEqual to deep compare keys/values
        const foundTx = txs.find((transaction) => transaction[attributeName] === attributeValue)

        if (foundTx) {
          return { transaction: foundTx, txLocation }
        }
      }
    }
  },
)

export const getTransactionByAttribute = createSelector(
  gatewayTransactions,
  currentChainId,
  extractSafeAddress,
  getTransactionWithLocationByAttribute,
  (_gatewayTransactions, _chainId, _safeAddress, txWithLocation) => {
    return txWithLocation?.transaction
  },
)

export const getTransactionsByNonce = createSelector(
  gatewayTransactions,
  currentChainId,
  extractSafeAddress,
  (_: AppReduxState, nonce: number) => nonce,
  (gatewayTransactions, chainId, safeAddress, nonce): Transaction[] => {
    let txsByNonce: Transaction[] = []

    for (const txLocation of txLocations) {
      const storedTxs: StoreStructure['history'] | StoreStructure['queued']['queued' | 'next'] | undefined = get(
        gatewayTransactions?.[chainId]?.[safeAddress],
        txLocation,
      )

      if (!storedTxs) {
        continue
      }

      for (const txs of Object.values(storedTxs)) {
        const txFoundByNonce = txs.filter(
          (tx) => isMultisigExecutionInfo(tx?.executionInfo) && tx.executionInfo?.nonce === nonce,
        )

        if (!txFoundByNonce.length) {
          continue
        }

        txsByNonce = [...txsByNonce, ...txFoundByNonce]
      }
    }

    return txsByNonce
  },
)

export const getLastTransaction = createSelector(
  nextTransactions,
  queuedTransactions,
  historyTransactions,
  (nextTxs, queuedTxs, historyTxs) => {
    if (queuedTxs && Object.keys(queuedTxs).length > 0) {
      const queuedNonces = Object.keys(queuedTxs)
      const highestQueuedNonce = Number(queuedNonces.sort()[queuedNonces.length - 1])
      const lastQueuedTx = Object.values(queuedTxs[highestQueuedNonce])[0]
      return lastQueuedTx
    }

    if (nextTxs && Object.keys(nextTxs).length > 0) {
      const nextTx = Object.values(nextTxs)[0][0]
      return nextTx
    }

    if (historyTxs) {
      // History Txs are ordered by timestamp so no need to sort them.
      const lastHistoryTx = flatten(Object.values(historyTxs)).find((tx) => tx.executionInfo != undefined) || null
      return lastHistoryTx
    }

    return null
  },
)

export const getLastTxNonce = createSelector(getLastTransaction, (lastTx) => {
  return isMultisigExecutionInfo(lastTx?.executionInfo) ? lastTx?.executionInfo.nonce : undefined
})
