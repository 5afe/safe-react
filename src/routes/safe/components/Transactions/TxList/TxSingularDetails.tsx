import { Dispatch, ReactElement, SetStateAction, useEffect, useState } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { TransactionDetails as GWTransactionDetails } from '@gnosis.pm/safe-react-gateway-sdk'
import { Loader } from '@gnosis.pm/safe-react-components'
import { useSelector } from 'react-redux'

import { Errors, logError } from 'src/logic/exceptions/CodedException'
import {
  StoreStructure,
  Transaction,
  TransactionDetails,
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
import { TxLocationContext } from './TxLocationProvider'
import { isTxQueued } from 'src/logic/safe/store/actions/utils'
import { makeTxFromDetails } from './utils'

const getTxLocation = (
  txDetails: GWTransactionDetails,
  nextTxs: StoreStructure['queued']['next'] | undefined,
): TxLocation => {
  if (!isTxQueued(txDetails.txStatus)) {
    return 'history'
  }

  const isNext = !!nextTxs && Object.values(nextTxs).some((txs) => txs.some(({ id }) => id === txDetails.txId))

  return isNext ? 'queued.next' : 'queued.queued'
}

type Props = {
  setSelectedTab: Dispatch<SetStateAction<string>>
}

const TxSingularDetails = ({ setSelectedTab }: Props): ReactElement => {
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
        // As it is retrieved vis safeTxHash, group transactions are not shown
        const txDetails = await fetchSafeTransaction(safeTxHash)

        if (isCurrent) {
          const tx = makeTxFromDetails(txDetails)
          setTx(tx)

          const txLocation = getTxLocation(txDetails, nextTxs)
          setTxLocation(txLocation)

          const selectedTab = isTxQueued(tx.txStatus)
            ? SAFE_ROUTES.TRANSACTIONS_QUEUE
            : SAFE_ROUTES.TRANSACTIONS_HISTORY
          setSelectedTab(selectedTab)
        }
      } catch (e) {
        logError(Errors._614, e.message)
        setTxLoadError(true)
      }
    }
    getTransaction()

    return () => {
      isCurrent = false
    }
  }, [safeTxHash, isLoaded, nextTxs, setSelectedTab])

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

  const transactions: TransactionDetails['transactions'] = [[tx.timestamp.toString(), [tx]]]

  if (isTxQueued(tx.txStatus)) {
    return (
      <TxLocationContext.Provider value={{ txLocation }}>
        <QueueTxList transactions={transactions} />
      </TxLocationContext.Provider>
    )
  } else {
    return <HistoryTxList transactions={transactions} />
  }
}

export default TxSingularDetails
