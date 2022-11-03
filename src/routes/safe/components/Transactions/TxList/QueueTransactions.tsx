import { Loader, Title } from '@gnosis.pm/safe-react-components'
import { ReactElement, useEffect, useMemo } from 'react'

import Img from 'src/components/layout/Img'
import NoTransactionsImage from './assets/no-transactions.svg'
import { usePagedQueuedTransactions } from './hooks/usePagedQueuedTransactions'
import { QueueTxList } from './QueueTxList'
import { Centered, NoTransactions } from './styled'
import { TxsInfiniteScroll } from './TxsInfiniteScroll'
import { TxLocationContext } from './TxLocationProvider'
import { BatchExecute } from 'src/routes/safe/components/Transactions/TxList/BatchExecute'
import { trackEvent } from 'src/utils/googleTagManager'
import { TX_LIST_EVENTS } from 'src/utils/events/txList'
import { BatchExecuteHoverProvider } from 'src/routes/safe/components/Transactions/TxList/BatchExecuteHoverProvider'

export const QueueTransactions = (): ReactElement => {
  const { count, isLoading, next, transactions } = usePagedQueuedTransactions()

  const queuedTxCount = useMemo(
    () => (transactions ? transactions.next.count + transactions.queue.count : 0),
    [transactions],
  )
  useEffect(() => {
    if (queuedTxCount > 0) {
      trackEvent({
        ...TX_LIST_EVENTS.QUEUED_TXS,
        label: queuedTxCount,
      })
    }
  }, [queuedTxCount])

  if (count === 0 && isLoading) {
    return (
      <Centered>
        <Loader size="md" />
      </Centered>
    )
  }

  // `loading` is, actually `!transactions`
  // added the `transaction` verification to prevent `Object is possibly 'undefined'` error
  if (count === 0 || !transactions) {
    return (
      <NoTransactions>
        <Img alt="No Transactions yet" src={NoTransactionsImage} />
        <Title size="xs">Queued transactions will appear here </Title>
      </NoTransactions>
    )
  }

  return (
    <BatchExecuteHoverProvider>
      <BatchExecute />
      <TxsInfiniteScroll next={next} isLoading={isLoading}>
        {/* Next list */}
        <TxLocationContext.Provider value={{ txLocation: 'queued.next' }}>
          {transactions.next.count !== 0 && <QueueTxList transactions={transactions.next.transactions} />}
        </TxLocationContext.Provider>

        {/* Queue list */}
        <TxLocationContext.Provider value={{ txLocation: 'queued.queued' }}>
          {transactions.queue.count !== 0 && <QueueTxList transactions={transactions.queue.transactions} />}
        </TxLocationContext.Provider>
      </TxsInfiniteScroll>
    </BatchExecuteHoverProvider>
  )
}
