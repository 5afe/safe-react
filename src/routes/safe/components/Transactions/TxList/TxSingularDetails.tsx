import { ReactElement, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Loader } from '@gnosis.pm/safe-react-components'
import { shallowEqual, useSelector } from 'react-redux'
import { TransactionDetails } from '@gnosis.pm/safe-react-gateway-sdk'

import { isTxQueued, TxLocation, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import {
  extractPrefixedSafeAddress,
  generateSafeRoute,
  SafeRouteSlugs,
  SAFE_ROUTES,
  TRANSACTION_ID_SLUG,
} from 'src/routes/routes'
import { Centered } from './styled'
import { TxLocationContext } from './TxLocationProvider'
import { AppReduxState } from 'src/store'
import { fetchSafeTransaction } from 'src/logic/safe/transactions/api/fetchSafeTransaction'
import { makeTxFromDetails } from './utils'
import { QueueTxList } from './QueueTxList'
import { HistoryTxList } from './HistoryTxList'
import FetchError from '../../FetchError'
import useAsync from 'src/logic/hooks/useAsync'
import { getTransactionWithLocationByAttribute } from 'src/logic/safe/store/selectors/gatewayTransactions'

const useStoredTx = (txId?: string): { txLocation: TxLocation; transaction?: Transaction } | null => {
  return (
    useSelector(
      (state: AppReduxState) =>
        txId ? getTransactionWithLocationByAttribute(state, { attributeName: 'id', attributeValue: txId }) : undefined,
      shallowEqual,
    ) || null
  )
}

const TxSingularDetails = (): ReactElement => {
  // Get a safeTxHash from the URL
  const { [TRANSACTION_ID_SLUG]: txId = '' } = useParams<SafeRouteSlugs>()
  const storedTx = useStoredTx(txId)

  // When this callback changes, we refetch the tx details
  const fetchTxDetails = useCallback(() => fetchSafeTransaction(txId), [txId])

  // Fetch tx details
  const { result: fetchedTx, error } = useAsync<TransactionDetails>(fetchTxDetails)

  if (error) {
    const safeParams = extractPrefixedSafeAddress()
    return (
      <FetchError
        text="Transaction not found"
        buttonText="See all transactions"
        redirectRoute={generateSafeRoute(SAFE_ROUTES.TRANSACTIONS, safeParams)}
      />
    )
  }

  const detailedTx = storedTx?.transaction || (fetchedTx ? makeTxFromDetails(fetchedTx) : null)

  if (!detailedTx) {
    return (
      <Centered padding={10}>
        <Loader size="sm" />
      </Centered>
    )
  }

  const isQueue = isTxQueued(detailedTx.txStatus)
  const TxList = isQueue ? QueueTxList : HistoryTxList
  const fallbackLocation: TxLocation = isQueue ? 'queued.queued' : 'history'

  return (
    <TxLocationContext.Provider value={{ txLocation: storedTx?.txLocation || fallbackLocation }}>
      <TxList transactions={[[detailedTx.timestamp.toString(), [detailedTx]]]} />
    </TxLocationContext.Provider>
  )
}

export default TxSingularDetails
