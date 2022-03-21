import { backOff, IBackOffOptions } from 'exponential-backoff'

import { NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { store } from 'src/store'
import { removePendingTransaction } from 'src/logic/safe/store/actions/pendingTransactions'
import { pendingTxIdsByChain } from 'src/logic/safe/store/selectors/pendingTransactions'

const _isTxMined = async (sessionBlockNumber: number, txHash: string): Promise<void> => {
  const MAX_WAITING_BLOCK = sessionBlockNumber + 50

  const web3 = getWeb3()

  if (
    // Transaction hasn't yet been mined
    !(await web3.eth.getTransactionReceipt(txHash)) &&
    // The current block is within waiting window
    (await web3.eth.getBlockNumber()) <= MAX_WAITING_BLOCK
  ) {
    throw new Error('Pending transaction not found')
  }
}

// Progressively after 10s, 20s, 40s, 80s, 160s, 320s - total of 6.5 minutes
const INITIAL_TIMEOUT = 10_000
const TIMEOUT_MULTIPLIER = 2
const MAX_ATTEMPTS = 6

const monitorTx = async (
  sessionBlockNumber: number,
  txId: string,
  txHash: string,
  options: Partial<IBackOffOptions> = {
    startingDelay: INITIAL_TIMEOUT,
    timeMultiple: TIMEOUT_MULTIPLIER,
    numOfAttempts: MAX_ATTEMPTS,
  },
): Promise<void> => {
  return backOff(() => PendingTxMonitor._isTxMined(sessionBlockNumber, txHash), options).catch(() => {
    // Unsuccessfully mined (threw in last backOff attempt)
    store.dispatch(removePendingTransaction({ id: txId }))
    store.dispatch(enqueueSnackbar(NOTIFICATIONS.TX_PENDING_FAILED_MSG))
  })
  // If mined, pending status is removed in the transaction middleware
  // when a transaction is added to historical transactions list
}

const monitorAllTxs = async (): Promise<void> => {
  const pendingTxsOnChain = pendingTxIdsByChain(store.getState())
  const pendingTxs = Object.entries(pendingTxsOnChain || {})

  // Don't check pending transactions if there are none
  if (pendingTxs.length === 0) {
    return
  }

  const web3 = getWeb3()

  try {
    const sessionBlockNumber = await web3.eth.getBlockNumber()
    await Promise.all(
      pendingTxs.map(([txId, txHash]) => {
        return PendingTxMonitor.monitorTx(sessionBlockNumber, txId, txHash)
      }),
    )
  } catch {
    // Ignore
  }
}

export const PendingTxMonitor = { _isTxMined, monitorTx, monitorAllTxs }
