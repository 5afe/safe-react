import { ReactElement, useEffect, useState } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { MultisigExecutionDetails, TransactionDetails } from '@gnosis.pm/safe-react-gateway-sdk'
import { Loader } from '@gnosis.pm/safe-react-components'

import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { isHistoricalTxStatus, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { fetchSafeTransaction } from 'src/logic/safe/transactions/api/fetchSafeTransaction'
import {
  extractPrefixedSafeAddress,
  generateSafeRoute,
  SafeRouteSlugs,
  SAFE_ROUTES,
  TRANSACTION_HASH_SLUG,
} from 'src/routes/routes'
import { HistoryTxList } from './HistoryTxList'
import { QueueTxList } from './QueueTxList'
import { Centered } from './styled'

// Our store does not match the details returned from the endpoint
const formatTx = ({ executedAt, txId, safeAppInfo, ...rest }: TransactionDetails): Transaction => ({
  ...rest,
  id: txId,
  timestamp: executedAt || 0,
})

const TxSingularDetails = (): ReactElement | null => {
  const { [TRANSACTION_HASH_SLUG]: safeTxHash = false } = useParams<SafeRouteSlugs>()
  const [tx, setTx] = useState<Transaction>()
  const [txLoadError, setTxLoadError] = useState<boolean>(false)

  useEffect(() => {
    let isCurrent = true

    if (!safeTxHash) {
      return
    }

    const getTransaction = async (): Promise<void> => {
      try {
        const transaction = await fetchSafeTransaction(safeTxHash)
        if (isCurrent) {
          const formattedTx = formatTx(transaction)
          setTx(formattedTx)
        }
      } catch (e) {
        logError(Errors._613, e.message)
        setTxLoadError(true)
      }
    }
    getTransaction()

    return () => {
      isCurrent = false
    }
  }, [safeTxHash])

  if (txLoadError) {
    const txHistory = generateSafeRoute(SAFE_ROUTES.TRANSACTIONS_HISTORY, extractPrefixedSafeAddress())
    return <Redirect to={txHistory} />
  }

  if (!tx) {
    return (
      <Centered padding={10}>
        <Loader size="sm" />
      </Centered>
    )
  }

  const isHistoricalTx = isHistoricalTxStatus(tx.txStatus)
  const TxList = isHistoricalTx ? HistoryTxList : QueueTxList

  const nonce = (tx.txDetails?.detailedExecutionInfo as MultisigExecutionDetails)?.nonce
  const label = nonce || tx.timestamp

  return <TxList transactions={[[label.toString(), [tx]]]} />
}

export default TxSingularDetails
