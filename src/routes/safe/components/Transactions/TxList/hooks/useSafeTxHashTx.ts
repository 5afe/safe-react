import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  isMultisigExecutionInfo,
  isStatusAwaitingConfirmation,
  isTxQueued,
  Transaction,
} from 'src/logic/safe/store/models/types/gateway.d'
import { getNetworkId } from 'src/config'
import { logError, Errors } from 'src/logic/exceptions/CodedException'
import {
  addQueuedTransactions,
  addHistoryTransactions,
} from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import { HistoryPayload, QueuedPayload } from 'src/logic/safe/store/reducer/gatewayTransactions'
import { fetchSafeTransaction } from 'src/logic/safe/transactions/api/fetchSafeTransaction'
import {
  extractPrefixedSafeAddress,
  extractSafeAddress,
  generateSafeRoute,
  history,
  SAFE_ROUTES,
} from 'src/routes/routes'
import { makeTxFromDetails } from '../utils'
import { currentSafeNonce } from 'src/logic/safe/store/selectors'

const useSafeTxHashTx = (safeTxHash: string): Transaction | undefined => {
  const dispatch = useDispatch()
  const nonce = useSelector(currentSafeNonce)
  const [fetchedTx, setFetchedTx] = useState<Transaction | undefined>()
  useEffect(() => {
    let isCurrent = true

    if (!safeTxHash) {
      return
    }

    const getTransaction = async (): Promise<void> => {
      try {
        const txDetails = await fetchSafeTransaction(safeTxHash)

        if (!isCurrent) {
          return
        }

        const tx = makeTxFromDetails(txDetails)

        // === Note: temp fix until the CGW updates rejected transactions to "REJECTED" status
        // https://github.com/gnosis/safe-client-gateway/issues/696
        const isLowerNonce = // CGW currently returns "AWAITING_EXECUTION" for rejected transactions
          isStatusAwaitingConfirmation(tx.txStatus) &&
          isMultisigExecutionInfo(tx.executionInfo) &&
          // If their nonce is lower than the current one then it is invalid
          tx.executionInfo?.nonce < nonce

        if (isLowerNonce) {
          const route = generateSafeRoute(SAFE_ROUTES.TRANSACTIONS_HISTORY, extractPrefixedSafeAddress())
          history.replace(route)
          return
        }
        // === end temp fix

        const payload: HistoryPayload | QueuedPayload = {
          chainId: getNetworkId(),
          safeAddress: extractSafeAddress(),
          values: [
            {
              transaction: tx,
              type: 'TRANSACTION',
              conflictType: 'None', // Not used in reducer
            },
          ],
        }

        // Add transaction to store
        dispatch(isTxQueued(tx.txStatus) ? addQueuedTransactions(payload) : addHistoryTransactions(payload))

        setFetchedTx(tx)
      } catch (e) {
        logError(Errors._614, e.message)
      }
    }

    getTransaction()

    return () => {
      isCurrent = false
    }
  }, [safeTxHash, dispatch, nonce])

  return fetchedTx
}

export default useSafeTxHashTx
