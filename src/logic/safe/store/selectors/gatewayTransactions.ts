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
import { currentSafeNonce } from 'src/logic/safe/store/selectors/index'
import { currentSafeAddress } from 'src/logic/currentSession/store/selectors'

const BATCH_LIMIT = 10

export const gatewayTransactions = (state: AppReduxState): AppReduxState['gatewayTransactions'] => {
  return state[GATEWAY_TRANSACTIONS_ID]
}

export const historyTransactions = createHashBasedSelector(
  gatewayTransactions,
  currentChainId,
  currentSafeAddress,
  (gatewayTransactions, chainId, safeAddress): StoreStructure['history'] | undefined => {
    return chainId && safeAddress ? gatewayTransactions[chainId]?.[safeAddress]?.history : undefined
  },
)

export const pendingTransactions = createSelector(
  gatewayTransactions,
  currentChainId,
  currentSafeAddress,
  (gatewayTransactions, chainId, safeAddress): StoreStructure['queued'] | undefined => {
    return chainId && safeAddress ? gatewayTransactions[chainId]?.[safeAddress]?.queued : undefined
  },
)

export const nextTransactions = createSelector(
  pendingTransactions,
  (pendingTransactions): StoreStructure['queued']['next'] | undefined => {
    return pendingTransactions?.next
  },
)

export const nextTransaction = createSelector(nextTransactions, (nextTxs) => {
  if (!nextTxs) return

  const [txs] = Object.values(nextTxs)
  return txs // If a reject tx exists, this will still return the initial tx
})

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
  currentSafeAddress,
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
  currentSafeAddress,
  getTransactionWithLocationByAttribute,
  (_gatewayTransactions, _chainId, _safeAddress, txWithLocation) => {
    return txWithLocation?.transaction
  },
)

export const getTransactionsByNonce = createSelector(
  gatewayTransactions,
  currentChainId,
  currentSafeAddress,
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
      return Object.values(queuedTxs[highestQueuedNonce])[0]
    }

    if (nextTxs && Object.keys(nextTxs).length > 0) {
      return Object.values(nextTxs)[0][0]
    }

    if (historyTxs) {
      // History Txs are ordered by timestamp so no need to sort them.
      return (
        Object.values(historyTxs)
          .flat()
          .find((tx) => tx.executionInfo != undefined) || null
      )
    }

    return null
  },
)

export const getLastTxNonce = createSelector(getLastTransaction, (lastTx) => {
  return isMultisigExecutionInfo(lastTx?.executionInfo) ? lastTx?.executionInfo.nonce : undefined
})

export const getBatchableTransactions = createSelector(
  nextTransaction,
  queuedTransactions,
  currentSafeNonce,
  (nextTxs, queuedTxs, safeNonce) => {
    const batchableTransactions: Transaction[] = []
    let currentNonce = safeNonce

    if (!nextTxs || !queuedTxs) return batchableTransactions

    // We slice as to not disturb the default order but still start from the most recent tx
    const sortedNextTxs = nextTxs.slice().sort((a, b) => b.timestamp - a.timestamp)
    const sortedQueuedTxs = Object.values(queuedTxs).map((tx) => tx.slice().sort((a, b) => b.timestamp - a.timestamp))

    const allTxs = [sortedNextTxs, ...sortedQueuedTxs]

    Object.values(allTxs).forEach((txByNonce) => {
      txByNonce.forEach((tx) => {
        if (
          batchableTransactions.length < BATCH_LIMIT &&
          isMultisigExecutionInfo(tx.executionInfo) &&
          tx.executionInfo.nonce === currentNonce &&
          tx.executionInfo.confirmationsSubmitted >= tx.executionInfo.confirmationsRequired
        ) {
          batchableTransactions.push(tx)
          currentNonce = tx.executionInfo.nonce + 1
        }
      })
    })

    return batchableTransactions
  },
)
