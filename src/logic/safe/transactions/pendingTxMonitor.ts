import { backOff } from 'exponential-backoff'

import { NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { getWeb3ReadOnly } from 'src/logic/wallets/getWeb3'
import { store } from 'src/store'
import { removePendingTransaction } from 'src/logic/safe/store/actions/pendingTransactions'
import { pendingTxIdsByChain } from 'src/logic/safe/store/selectors/pendingTransactions'

export const isPendingTxMined = async (sessionBlockNumber: number, txId: string, txHash: string): Promise<void> => {
  const MAX_WAITING_BLOCK = sessionBlockNumber + 50

  const web3 = getWeb3ReadOnly()
  const tx = await web3.eth.getTransaction(txHash)

  if (tx || (await web3.eth.getBlockNumber()) >= MAX_WAITING_BLOCK) {
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
  const pendingTxIds = Object.keys(pendingTxsOnChain || {})

  // Don't check pending transactions if there are none
  if (pendingTxIds.length === 0) {
    return
  }

  const web3 = getWeb3ReadOnly()

  // Get current block on chain
  let sessionBlockNumber: number
  try {
    sessionBlockNumber = await web3.eth.getBlockNumber()
  } catch {
    return
  }

  // Exponentially watch each pending transaction for (un-)successful mine within 50 blocks
  for (const txId in pendingTxsOnChain) {
    try {
      await backOff(() => isPendingTxMined(sessionBlockNumber, txId, pendingTxsOnChain[txId]), {
        startingDelay: 10_000,
        numOfAttempts: 6,
      })
    } catch {}
  }
}
