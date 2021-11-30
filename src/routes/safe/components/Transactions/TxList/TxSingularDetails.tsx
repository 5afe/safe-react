import { ReactElement, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Loader } from '@gnosis.pm/safe-react-components'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'

import { isTxQueued } from 'src/logic/safe/store/models/types/gateway.d'
import { extractSafeAddress, SafeRouteSlugs, TRANSACTION_ID_SLUG } from 'src/routes/routes'
import { Centered } from './styled'
import {
  getTransactionWithLocationByAttribute,
  historyTransactions,
  nextTransactions,
  queuedTransactions,
} from 'src/logic/safe/store/selectors/gatewayTransactions'
import { TxLocationContext } from './TxLocationProvider'
import { QueueTxList } from './QueueTxList'
import { HistoryTxList } from './HistoryTxList'
import { AppReduxState } from 'src/store'
import { logError, Errors } from 'src/logic/exceptions/CodedException'
import { fetchSafeTransaction } from 'src/logic/safe/transactions/api/fetchSafeTransaction'
import { makeTxFromDetails } from './utils'
import {
  addQueuedTransactions,
  addHistoryTransactions,
} from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import { HistoryPayload, QueuedPayload } from 'src/logic/safe/store/reducer/gatewayTransactions'
import { currentChainId } from 'src/logic/config/store/selectors'

const TxSingularDetails = (): ReactElement => {
  const { [TRANSACTION_ID_SLUG]: txId = '' } = useParams<SafeRouteSlugs>()

  const dispatch = useDispatch()
  const chainId = useSelector(currentChainId)
  const historyTxs = useSelector(historyTransactions)
  const nextTxs = useSelector(nextTransactions)
  const queueTxs = useSelector(queuedTransactions)
  const isLoaded = [historyTxs, nextTxs, queueTxs].every(Boolean)

  // We must use the tx from the store as the queue actions alter the tx
  const liveTx = useSelector(
    (state: AppReduxState) =>
      getTransactionWithLocationByAttribute(state, { attributeName: 'id', attributeValue: txId }),
    shallowEqual, // Check for txLocation change
  )

  useEffect(() => {
    let isCurrent = true

    if (!txId || liveTx) {
      return
    }

    const getTransaction = async (): Promise<void> => {
      try {
        const txDetails = await fetchSafeTransaction(txId)
        if (isCurrent) {
          const tx = makeTxFromDetails(txDetails)

          const payload: HistoryPayload | QueuedPayload = {
            chainId,
            safeAddress: extractSafeAddress(),
            values: [
              {
                transaction: tx,
                type: 'TRANSACTION', // Other types are discarded in reducer
                conflictType: 'None', // Not used in reducer
              },
            ],
          }

          // Add transaction to store
          dispatch(isTxQueued(tx.txStatus) ? addQueuedTransactions(payload) : addHistoryTransactions(payload))
        }
      } catch (e) {
        logError(Errors._614, e.message)
      }
    }
    getTransaction()

    return () => {
      isCurrent = false
    }
  }, [txId, liveTx, dispatch, chainId])

  if (!isLoaded || !liveTx) {
    return (
      <Centered padding={10}>
        <Loader size="sm" />
      </Centered>
    )
  }

  const { transaction, txLocation } = liveTx
  const TxList = isTxQueued(transaction.txStatus) ? QueueTxList : HistoryTxList

  return (
    <TxLocationContext.Provider value={{ txLocation }}>
      <TxList transactions={[[transaction.timestamp.toString(), [transaction]]]} />
    </TxLocationContext.Provider>
  )
}

export default TxSingularDetails
