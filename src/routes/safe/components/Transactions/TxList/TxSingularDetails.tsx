import { ReactElement, useEffect, useState } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { MultisigExecutionDetails, MultisigExecutionInfo, TransactionDetails } from '@gnosis.pm/safe-react-gateway-sdk'
import { Loader } from '@gnosis.pm/safe-react-components'

import { Errors, logError } from 'src/logic/exceptions/CodedException'
import {
  isModuleExecutionInfo,
  isMultiSigExecutionDetails,
  StoreStructure,
  Transaction,
  TxLocation,
} from 'src/logic/safe/store/models/types/gateway.d'
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
import {
  historyTransactions,
  nextTransactions,
  queuedTransactions,
} from 'src/logic/safe/store/selectors/gatewayTransactions'
import { useSelector } from 'react-redux'
import { isTxPending } from 'src/logic/safe/store/actions/utils'

// Our store does not match the details returned from the endpoint
const formatTx = (txDetails: TransactionDetails): Transaction => {
  const getMissingSigners = ({
    signers,
    confirmations,
  }: MultisigExecutionDetails): MultisigExecutionInfo['missingSigners'] => {
    const missingSigners = signers.filter(({ value }) => {
      const hasConfirmed = confirmations?.some(({ signer }) => signer.value === value)
      return !hasConfirmed
    })

    return !!missingSigners.length ? missingSigners : null
  }

  const getMultisigExecutionInfo = ({
    detailedExecutionInfo,
  }: TransactionDetails): MultisigExecutionInfo | undefined => {
    if (!isMultiSigExecutionDetails(detailedExecutionInfo)) return undefined

    return {
      type: detailedExecutionInfo.type,
      nonce: detailedExecutionInfo.nonce,
      confirmationsRequired: detailedExecutionInfo.confirmationsRequired,
      confirmationsSubmitted: detailedExecutionInfo.confirmations?.length || 0,
      missingSigners: getMissingSigners(detailedExecutionInfo),
    }
  }

  const executionInfo: Transaction['executionInfo'] = isModuleExecutionInfo(txDetails.detailedExecutionInfo)
    ? txDetails.detailedExecutionInfo
    : getMultisigExecutionInfo(txDetails)

  const tx: Transaction = {
    id: txDetails.txId,
    timestamp: txDetails.executedAt || 0, // TODO: What is the fallback here?
    txStatus: txDetails.txStatus,
    txInfo: txDetails.txInfo,
    executionInfo,
    safeAppInfo: txDetails?.safeAppInfo || undefined,
    txDetails,
  }

  return tx
}

const getTxLocation = (
  txDetails: TransactionDetails,
  nextTxs: StoreStructure['queued']['next'] | undefined,
): TxLocation => {
  if (!isTxPending(txDetails.txStatus)) {
    return 'history'
  }

  const isNext = !!nextTxs && Object.values(nextTxs).some((txs) => txs.some(({ id }) => id === txDetails.txId))

  return isNext ? 'queued.next' : 'queued.queued'
}

const TxSingularDetails = (): ReactElement | null => {
  const { [TRANSACTION_HASH_SLUG]: safeTxHash = false } = useParams<SafeRouteSlugs>()
  const [tx, setTx] = useState<Transaction>()
  const [txLocation, setTxLocation] = useState<TxLocation>()
  const [txLoadError, setTxLoadError] = useState<boolean>(false)

  const historyTxs = useSelector(historyTransactions)
  const nextTxs = useSelector(nextTransactions)
  const queueTxs = useSelector(queuedTransactions)

  const isLoaded = [historyTxs, nextTxs, queueTxs].every(Boolean)

  useEffect(() => {
    let isCurrent = true

    if (!safeTxHash || !isLoaded) {
      return
    }

    const getTransaction = async (): Promise<void> => {
      try {
        const txDetails = await fetchSafeTransaction(safeTxHash)

        if (isCurrent) {
          const tx = formatTx(txDetails)
          setTx(tx)

          const txLocation = getTxLocation(txDetails, nextTxs)
          setTxLocation(txLocation)
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
  }, [safeTxHash, isLoaded, nextTxs])

  if (txLoadError) {
    const txHistory = generateSafeRoute(SAFE_ROUTES.TRANSACTIONS_HISTORY, extractPrefixedSafeAddress())
    return <Redirect to={txHistory} />
  }

  if (!tx || !txLocation || !isLoaded) {
    return (
      <Centered padding={10}>
        <Loader size="sm" />
      </Centered>
    )
  }

  const TxList = isTxPending(tx.txStatus) ? QueueTxList : HistoryTxList

  const nonce = (tx.txDetails?.detailedExecutionInfo as MultisigExecutionDetails)?.nonce
  const label = nonce || tx.timestamp

  return <TxList transactions={[[label.toString(), [tx]]]} />
}

export default TxSingularDetails
