import { ReactElement, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loader } from '@gnosis.pm/safe-react-components'
import { useDispatch, useSelector } from 'react-redux'

import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { isTxQueued, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { fetchSafeTransaction } from 'src/logic/safe/transactions/api/fetchSafeTransaction'
import { extractSafeAddress, SafeRouteSlugs, TRANSACTION_HASH_SLUG } from 'src/routes/routes'
import { Centered } from './styled'
import {
  getTransactionWithLocationById,
  historyTransactions,
  nextTransactions,
  queuedTransactions,
} from 'src/logic/safe/store/selectors/gatewayTransactions'
import { TxLocationContext } from './TxLocationProvider'
import { makeTxFromDetails } from './utils'
import { QueueTxList } from './QueueTxList'
import { HistoryTxList } from './HistoryTxList'
import { AppReduxState } from 'src/store'
import {
  addHistoryTransactions,
  addQueuedTransactions,
} from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import { HistoryPayload, QueuedPayload } from 'src/logic/safe/store/reducer/gatewayTransactions'
import { getNetworkId } from 'src/config'

const TxSingularDetails = (): ReactElement => {
  const historyTxs = useSelector(historyTransactions)
  const nextTxs = useSelector(nextTransactions)
  const queueTxs = useSelector(queuedTransactions)
  const isLoaded = [historyTxs, nextTxs, queueTxs].every(Boolean)

  const { [TRANSACTION_HASH_SLUG]: safeTxHash = '' } = useParams<SafeRouteSlugs>()
  const safeTxHashTx = useSafeTxHashTx(safeTxHash)

  // Use id from safeTxHashTx to get transaction from store
  const storedTx = useSelector((state: AppReduxState) => getTransactionWithLocationById(state, safeTxHashTx?.id || ''))

  if (!isLoaded || !storedTx) {
    return (
      <Centered padding={10}>
        <Loader size="sm" />
      </Centered>
    )
  }
  const { transaction, txLocation } = storedTx
  const TxList = isTxQueued(transaction.txStatus) ? QueueTxList : HistoryTxList

  return (
    <TxLocationContext.Provider value={{ txLocation }}>
      <TxList transactions={[[transaction.timestamp.toString(), [transaction]]]} />
    </TxLocationContext.Provider>
  )
}

const useSafeTxHashTx = (safeTxHash: string): Transaction | undefined => {
  const dispatch = useDispatch()
  const [loadedTx, setLoadedTx] = useState<Transaction | undefined>()

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

        setLoadedTx(tx)
      } catch (e) {
        logError(Errors._614, e.message)
      }
    }

    getTransaction()

    return () => {
      isCurrent = false
    }
  }, [safeTxHash, dispatch])

  return loadedTx
}

export default TxSingularDetails
