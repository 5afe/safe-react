import { ReactElement, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Loader } from '@gnosis.pm/safe-react-components'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { TransactionDetails, TransactionStatus } from '@gnosis.pm/safe-react-gateway-sdk'

import {
  isMultiSigExecutionDetails,
  isStatusAwaitingConfirmation,
  isTxQueued,
} from 'src/logic/safe/store/models/types/gateway.d'
import { extractSafeAddress, SafeRouteSlugs, TRANSACTION_ID_SLUG } from 'src/routes/routes'
import { Centered } from './styled'
import { getTransactionWithLocationByAttribute } from 'src/logic/safe/store/selectors/gatewayTransactions'
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
import { ExecutingTxHistoryState } from 'src/logic/safe/store/actions/createTransaction'

const TxSingularDetails = (): ReactElement => {
  const { [TRANSACTION_ID_SLUG]: safeTxHash = '' } = useParams<SafeRouteSlugs>()

  const [fetchedTxId, setFetchedTxId] = useState<string>('')
  const location = useLocation<ExecutingTxHistoryState>()
  const dispatch = useDispatch()
  const chainId = useSelector(currentChainId)

  // We must use the tx from the store as the queue actions alter the tx
  const liveTx = useSelector(
    (state: AppReduxState) =>
      getTransactionWithLocationByAttribute(state, { attributeName: 'id', attributeValue: fetchedTxId }),
    shallowEqual,
  )

  useEffect(() => {
    let isCurrent = true

    if (!safeTxHash) {
      return
    }

    const getTransaction = async (): Promise<void> => {
      setFetchedTxId('')
      let txDetails: TransactionDetails
      try {
        txDetails = await fetchSafeTransaction(safeTxHash)
      } catch (e) {
        logError(Errors._614, e.message)
        return
      }

      if (!isCurrent || !txDetails.txId) {
        return
      }

      setFetchedTxId(txDetails.txId)

      // Transaction was proposed with a threshold of 1 and chose to execute
      const isExecutingCreatedTx = location.state?.isExecution && isStatusAwaitingConfirmation(txDetails.txStatus)
      if (isExecutingCreatedTx) {
        txDetails.txStatus = TransactionStatus.PENDING

        if (isMultiSigExecutionDetails(txDetails.detailedExecutionInfo)) {
          txDetails.detailedExecutionInfo.confirmations = [
            { signature: '', submittedAt: Date.now(), signer: txDetails.detailedExecutionInfo.signers[0] },
          ]
        }
      }

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
    getTransaction()

    return () => {
      isCurrent = false
    }
  }, [safeTxHash, dispatch, chainId, location.state?.isExecution])

  if (!liveTx) {
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
