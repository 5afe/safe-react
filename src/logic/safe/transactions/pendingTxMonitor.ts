import { backOff, IBackOffOptions } from 'exponential-backoff'

import { NOTIFICATIONS } from 'src/logic/notifications'
import { showNotification } from 'src/logic/notifications/store/notifications'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { store } from 'src/store'
import { removePendingTransaction } from 'src/logic/safe/store/actions/pendingTransactions'
import { pendingTxIdsByChain } from 'src/logic/safe/store/selectors/pendingTransactions'
import { didTxRevert } from 'src/logic/safe/store/actions/transactions/utils/transactionHelpers'
import { generatePath } from 'react-router-dom'
import { currentSession } from 'src/logic/currentSession/store/selectors'
import { SAFE_ROUTES, SAFE_ADDRESS_SLUG, getPrefixedSafeAddressSlug, TRANSACTION_ID_SLUG } from 'src/routes/routes'

const _isTxMined = async (blockNumber: number, txHash: string): Promise<boolean> => {
  const MAX_WAITING_BLOCK = blockNumber + 50

  const web3 = getWeb3()

  const receipt = await web3.eth.getTransactionReceipt(txHash)

  if (receipt) {
    return !didTxRevert(receipt)
  }

  if ((await web3.eth.getBlockNumber()) <= MAX_WAITING_BLOCK) {
    // backOff retries
    throw new Error('Pending transaction not found')
  }

  return false
}

// Progressively after 10s, 20s, 40s, 80s, 160s, 320s - total of 6.5 minutes
const INITIAL_TIMEOUT = 10_000
const TIMEOUT_MULTIPLIER = 2
const MAX_ATTEMPTS = 6

const monitorTx = async ({
  block,
  txId,
  txHash,
  safeAddress,
  shortName,
  options = {
    startingDelay: INITIAL_TIMEOUT,
    timeMultiple: TIMEOUT_MULTIPLIER,
    numOfAttempts: MAX_ATTEMPTS,
  },
}: {
  block: number
  txId: string
  txHash: string
  safeAddress: string
  shortName: string
  options?: Partial<IBackOffOptions>
}): Promise<void> => {
  return backOff(() => PendingTxMonitor._isTxMined(block, txHash), options)
    .then((isMined) => {
      if (!isMined) {
        store.dispatch(removePendingTransaction({ id: txId }))
      }
      // If successfully mined the transaction will be removed by the automatic polling
    })
    .catch(() => {
      // Unsuccessfully mined (threw in last backOff attempt)
      store.dispatch(removePendingTransaction({ id: txId }))

      const deeplink = generatePath(SAFE_ROUTES.TRANSACTIONS_SINGULAR, {
        [SAFE_ADDRESS_SLUG]: getPrefixedSafeAddressSlug({ shortName, safeAddress }),
        [TRANSACTION_ID_SLUG]: txId,
      })

      store.dispatch(
        showNotification({ ...NOTIFICATIONS.TX_PENDING_FAILED_MSG, link: { to: deeplink, title: 'View Transaction' } }),
      )
    })
}

const monitorAllTxs = async (): Promise<void> => {
  const state = store.getState()

  // Use details of Safe that monitoring starts on
  const { currentShortName, currentSafeAddress } = currentSession(state) || {}

  const pendingTxsOnChain = pendingTxIdsByChain(state)
  const pendingTxs = Object.entries(pendingTxsOnChain || {})

  // Don't check pending transactions if there are none
  if (pendingTxs.length === 0) {
    return
  }

  const web3 = getWeb3()

  try {
    const sessionBlockNumber = await web3.eth.getBlockNumber()
    await Promise.all(
      pendingTxs.map(([txId, { txHash, block = sessionBlockNumber }]) => {
        return PendingTxMonitor.monitorTx({
          block,
          txId,
          txHash,
          safeAddress: currentSafeAddress,
          shortName: currentShortName,
        })
      }),
    )
  } catch {
    // Ignore
  }
}

export const PendingTxMonitor = { _isTxMined, monitorTx, monitorAllTxs }
