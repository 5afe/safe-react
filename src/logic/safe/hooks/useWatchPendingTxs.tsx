import { backOff } from 'exponential-backoff'
import { useEffect } from 'react'

import { useSelector } from 'react-redux'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { removePendingTransaction } from 'src/logic/safe/store/actions/pendingTransactions'
import { pendingTxIdsByChain } from 'src/logic/safe/store/selectors/pendingTransactions'

export const useWatchPendingTxs = () => {
  const pendingTxsOnChain = useSelector(pendingTxIdsByChain)
  const web3 = getWeb3()

  useEffect(() => {
    const pendingTxs = Object.entries(pendingTxsOnChain || {})

    if (pendingTxs.length === 0) {
      return
    }

    const watchPendingTxs = async () => {
      const blockNumber = await web3.eth.getBlockNumber()

      for (const [txId, txHash] of pendingTxs[0]) {
        let shouldRetry = true
        await backOff(
          async () => {
            const tx = await web3.eth.getTransaction(txHash)

            // Transaction has been successfully mined
            if (tx) {
              shouldRetry = false
              // Pending status will be removed in the transaction reducer when the CGW
              // returns it as succesful, in the history list
              return
            }

            // Has mined 50 blocks since render
            const currentBlockNumber = await web3.eth.getBlockNumber()

            if (currentBlockNumber >= blockNumber + 50) {
              // @TODO: should show notification that it failed to send the transaction
              // (as is displayed when transaction fails in TxSender after block timeout)
              removePendingTransaction({ id: txId })
              shouldRetry = false
            }
          },
          {
            startingDelay: 1000 * 10,
            timeMultiple: 3,
            numOfAttempts: 6,
            retry: () => shouldRetry,
          },
        )
      }
    }

    watchPendingTxs()
  }, [])
}
