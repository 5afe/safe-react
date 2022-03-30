import { ReactElement, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Loader } from '@gnosis.pm/safe-react-components'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { TransactionDetails } from '@gnosis.pm/safe-react-gateway-sdk'

import { isTxQueued } from 'src/logic/safe/store/models/types/gateway.d'
import {
  extractPrefixedSafeAddress,
  extractSafeAddress,
  generateSafeRoute,
  SafeRouteSlugs,
  SAFE_ROUTES,
  TRANSACTION_ID_SLUG,
} from 'src/routes/routes'
import { Centered } from './styled'
import { getTransactionWithLocationByAttribute } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { TxLocationContext } from './TxLocationProvider'
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
import { QueueTxList } from './QueueTxList'
import { HistoryTxList } from './HistoryTxList'
import FetchError from '../../FetchError'
import { useQueueTransactions } from './hooks/useQueueTransactions'

const TxSingularDetails = (): ReactElement => {
  const { [TRANSACTION_ID_SLUG]: safeTxHash = '' } = useParams<SafeRouteSlugs>()
  const [fetchedTx, setFetchedTx] = useState<TransactionDetails>()
  const [error, setError] = useState<Error>()
  const dispatch = useDispatch()
  const history = useHistory()
  const chainId = useSelector(currentChainId)
  const transactions = useQueueTransactions()

  const indexedTx = useSelector(
    (state: AppReduxState) =>
      fetchedTx
        ? getTransactionWithLocationByAttribute(state, { attributeName: 'id', attributeValue: fetchedTx.txId })
        : null,
    shallowEqual,
  )

  // When safeTxHash changes, we fetch tx for this hash to get the txId
  useEffect(() => {
    let isCurrent = true

    setFetchedTx(undefined)

    if (!safeTxHash) {
      const txsRoute = generateSafeRoute(SAFE_ROUTES.TRANSACTIONS, extractPrefixedSafeAddress())
      history.replace(txsRoute)
      return
    }

    const getTransaction = async (): Promise<void> => {
      let txDetails: TransactionDetails
      try {
        txDetails = await fetchSafeTransaction(safeTxHash)
      } catch (e) {
        logError(Errors._614, e.message)
        setError(e)
        return
      }

      if (isCurrent) {
        setFetchedTx(txDetails)
      }
    }

    getTransaction()

    return () => {
      isCurrent = false
    }
  }, [history, safeTxHash, setFetchedTx])

  // Add the tx to the store
  useEffect(() => {
    if (!fetchedTx || indexedTx) {
      return
    }

    // Format the tx details into a History or Queue-like tx item
    const listItemTx = makeTxFromDetails(fetchedTx)
    const payload: HistoryPayload | QueuedPayload = {
      chainId,
      safeAddress: extractSafeAddress(),
      values: [
        {
          transaction: listItemTx,
          type: 'TRANSACTION', // Other types are discarded in reducer
          conflictType: 'None', // Not used in reducer
        },
      ],
    }

    // Add historical transaction
    if (!isTxQueued(listItemTx.txStatus)) {
      dispatch(addHistoryTransactions(payload))
      return
    }

    // Don't add queued transaction until transaction store has initialised
    if (!transactions) {
      return
    }

    // Prepend label to queue transaction payload
    const isNext = transactions.next.transactions.some(([, txs]) => txs.some(({ id }) => id === listItemTx.id))
    payload.values = [
      {
        label: isNext ? 'next' : 'queued',
        type: 'LABEL',
      },
      ...payload.values,
    ]

    // Add queued transaction
    dispatch(addQueuedTransactions(payload))
  }, [fetchedTx, chainId, dispatch, transactions, indexedTx])

  if (!indexedTx && error) {
    const safeParams = extractPrefixedSafeAddress()
    return (
      <FetchError
        text="Transaction not found"
        buttonText="See all transactions"
        redirectRoute={generateSafeRoute(SAFE_ROUTES.TRANSACTIONS, safeParams)}
      />
    )
  }

  if (!indexedTx) {
    return (
      <Centered padding={10}>
        <Loader size="sm" />
      </Centered>
    )
  }

  const { transaction, txLocation } = indexedTx
  const TxList = isTxQueued(transaction.txStatus) ? QueueTxList : HistoryTxList

  return (
    <TxLocationContext.Provider value={{ txLocation }}>
      <TxList transactions={[[transaction.timestamp.toString(), [transaction]]]} />
    </TxLocationContext.Provider>
  )
}

export default TxSingularDetails
