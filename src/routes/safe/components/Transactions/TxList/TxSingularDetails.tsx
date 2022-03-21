import { ReactElement, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Loader } from '@gnosis.pm/safe-react-components'
import { shallowEqual, useSelector } from 'react-redux'
import { TransactionDetails } from '@gnosis.pm/safe-react-gateway-sdk'

import { isTxQueued } from 'src/logic/safe/store/models/types/gateway.d'
import {
  extractPrefixedSafeAddress,
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
import { QueueTxList } from './QueueTxList'
import { HistoryTxList } from './HistoryTxList'
import FetchError from '../../FetchError'

const TxSingularDetails = (): ReactElement => {
  const { [TRANSACTION_ID_SLUG]: safeTxHash = '' } = useParams<SafeRouteSlugs>()
  const [fetchedTx, setFetchedTx] = useState<TransactionDetails>()
  const [error, setError] = useState<Error>()
  const history = useHistory()

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
