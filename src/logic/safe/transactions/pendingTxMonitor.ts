import { backOff } from 'exponential-backoff'

import { NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { store } from 'src/store'
import { removePendingTransaction } from 'src/logic/safe/store/actions/pendingTransactions'
import { pendingTxIdsByChain } from 'src/logic/safe/store/selectors/pendingTransactions'

const MAX_ATTEMPTS = 6

let currentAttempt = 0

const hasReachedMaxAttempts = (): boolean => currentAttempt >= MAX_ATTEMPTS

export const isPendingTxMined = async (sessionBlockNumber: number, txId: string, txHash: string): Promise<void> => {
  const MAX_WAITING_BLOCK = sessionBlockNumber + 50

  currentAttempt++

  const web3 = getWeb3()

  if (
    hasReachedMaxAttempts() ||
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
  const START_DELAY = 10_000

  const state = store.getState()

  const pendingTxsOnChain = pendingTxIdsByChain(state)
  const pendingTxs = Object.entries(pendingTxsOnChain || {})

  // Don't check pending transactions if there are none
  if (pendingTxs.length === 0) {
    return
  }

  const web3 = getWeb3()

  try {
    const sessionBlockNumber = await web3.eth.getBlockNumber()

    // Exponentially watch each pending transaction for (un-)successful mine within 50 blocks
    await Promise.all(
      pendingTxs.map(([txId, txHash]) => {
        backOff(() => isPendingTxMined(sessionBlockNumber, txId, txHash), {
          startingDelay: START_DELAY,
          numOfAttempts: MAX_ATTEMPTS,
          retry: () => !hasReachedMaxAttempts(),
        })
      }),
    )
  } catch {
    // Ignore
  }
}
