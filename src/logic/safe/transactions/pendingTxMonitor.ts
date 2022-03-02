import { backOff } from 'exponential-backoff'

import { NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { store } from 'src/store'
import { removePendingTransaction } from 'src/logic/safe/store/actions/pendingTransactions'
import { pendingTxIdsByChain } from 'src/logic/safe/store/selectors/pendingTransactions'

// Progressively after 10s, 20s, 40s, 80s, 160s, 320s
const INITIAL_TIMEOUT = 10_000
const TIMEOUT_MULTIPLIER = 2
const MAX_ATTEMPTS = 6

const hasReachedMaxAttempts = (currentAttempt: number): boolean => currentAttempt >= MAX_ATTEMPTS

export const isPendingTxMined = async (
  sessionBlockNumber: number,
  txId: string,
  txHash: string,
  hasReachedMaxAttempts: boolean,
): Promise<void> => {
  const MAX_WAITING_BLOCK = sessionBlockNumber + 50

  const web3 = getWeb3()

  if (
    hasReachedMaxAttempts ||
    // Transaction was successfully mined
    (await web3.eth.getTransaction(txHash)) ||
    // Transaction was not mined within max block amount
    (await web3.eth.getBlockNumber()) >= MAX_WAITING_BLOCK
  ) {
    store.dispatch(removePendingTransaction({ id: txId }))
    store.dispatch(enqueueSnackbar(NOTIFICATIONS.TX_PENDING_FAILED_MSG))
  } else {
    // backOff must throw in order to retry
    throw new Error('Pending transaction not found')
  }
}

export const pendingTxsMonitor = async (): Promise<void> => {
  const state = store.getState()

  const pendingTxsOnChain = pendingTxIdsByChain(state)
  const pendingTxs = Object.entries(pendingTxsOnChain || {})

  // Don't check pending transactions if there are none
  if (pendingTxs.length === 0) {
    return
  }

  const web3 = getWeb3()

  let sessionBlockNumber: number
  try {
    sessionBlockNumber = await web3.eth.getBlockNumber()
  } catch {
    // Don't continue if there was an error retrieving current block number
    return
  }

  for (const [txId, txHash] of pendingTxs) {
    let currentAttempt = 0

    try {
      await backOff(
        () => {
          currentAttempt++
          return isPendingTxMined(sessionBlockNumber, txId, txHash, hasReachedMaxAttempts(currentAttempt))
        },
        {
          startingDelay: INITIAL_TIMEOUT,
          timeMultiple: TIMEOUT_MULTIPLIER,
          numOfAttempts: MAX_ATTEMPTS,
          retry: () => !hasReachedMaxAttempts(currentAttempt),
        },
      )
    } catch {
      // Ignore
    }
  }
}
