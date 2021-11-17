import { ReactElement, useEffect, useState } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { AccordionDetails, Loader } from '@gnosis.pm/safe-react-components'
import { useSelector } from 'react-redux'

import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { isTxQueued, StoreStructure, Transaction, TxLocation } from 'src/logic/safe/store/models/types/gateway.d'
import { fetchSafeTransaction } from 'src/logic/safe/transactions/api/fetchSafeTransaction'
import {
  extractPrefixedSafeAddress,
  generateSafeRoute,
  SafeRouteSlugs,
  SAFE_ROUTES,
  TRANSACTION_HASH_SLUG,
} from 'src/routes/routes'
import { HistoryTxListTitle } from './HistoryTxList'
import { QueueTxListTitle } from './QueueTxList'
import {
  Centered,
  NoPaddingAccordion,
  StyledAccordionSummary,
  StyledTransactions,
  StyledTransactionsGroup,
} from './styled'
import {
  historyTransactions,
  nextTransactions,
  queuedTransactions,
} from 'src/logic/safe/store/selectors/gatewayTransactions'
import { TxLocationContext } from './TxLocationProvider'
import { makeTxFromDetails } from './utils'
import { TxDetailsDisplay } from './TxDetails'
import { TxHistoryCollapsed } from './TxHistoryCollapsed'
import { TxQueueCollapsed } from './TxQueueCollapsed'
import { useTransactionActions } from './hooks/useTransactionActions'

const getTxLocation = (tx: Transaction, nextTxs: StoreStructure['queued']['next'] | undefined): TxLocation => {
  if (!isTxQueued(tx.txStatus)) {
    return 'history'
  }

  const isNext = nextTxs && Object.values(nextTxs).some((txs) => txs.some(({ id }) => id === tx.id))

  return isNext ? 'queued.next' : 'queued.queued'
}

const TxSingularDetails = (): ReactElement => {
  const { [TRANSACTION_HASH_SLUG]: safeTxHash = false } = useParams<SafeRouteSlugs>()
  const [tx, setTx] = useState<Transaction>()
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
  }, [safeTxHash, isLoaded])

  if (txLoadError) {
    const txHistory = generateSafeRoute(SAFE_ROUTES.TRANSACTIONS_HISTORY, extractPrefixedSafeAddress())
    return <Redirect to={txHistory} />
  }

  if (!tx || !isLoaded) {
    return (
      <Centered padding={10}>
        <Loader size="sm" />
      </Centered>
    )
  }

  const isQueued = isTxQueued(tx.txStatus)

  const title = isQueued ? <QueueTxListTitle /> : <HistoryTxListTitle timestamp={tx.timestamp.toString()} />
  const header = isQueued ? <TxQueueCollapsed transaction={tx} /> : <TxHistoryCollapsed transaction={tx} />
  const transactionDisplay = isQueued ? (
    <TxQueueDetailsDisplay transaction={tx} />
  ) : (
    <TxDetailsDisplay transaction={tx} />
  )

  return (
    <TxLocationContext.Provider value={{ txLocation: getTxLocation(tx, nextTxs) }}>
      <StyledTransactionsGroup>
        {title}
        <StyledTransactions>
          <NoPaddingAccordion expanded>
            <StyledAccordionSummary expandIcon={null}>{header}</StyledAccordionSummary>
            <AccordionDetails>{transactionDisplay}</AccordionDetails>
          </NoPaddingAccordion>
        </StyledTransactions>
      </StyledTransactionsGroup>
    </TxLocationContext.Provider>
  )
}

const TxQueueDetailsDisplay = ({ transaction }: { transaction: Transaction }): ReactElement => {
  const actions = useTransactionActions(transaction)
  return <TxDetailsDisplay transaction={transaction} actions={actions} />
}

export default TxSingularDetails
