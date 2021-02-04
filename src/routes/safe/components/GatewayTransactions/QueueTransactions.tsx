import { Loader } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'

import { InfiniteScroll, SCROLLABLE_TARGET_ID } from 'src/components/InfiniteScroll'
import { usePagedQueuedTransactions } from './hooks/usePagedQueuedTransactions'
import { ActionModal } from './ActionModal'
import { TxActionProvider } from './TxActionProvider'
import { TxLocationContext } from './TxLocationProvider'
import { QueueTxList } from './QueueTxList'
import { ScrollableTransactionsContainer, Centered } from './styled'

export const QueueTransactions = (): ReactElement => {
  const { count, loading, hasMore, next, transactions } = usePagedQueuedTransactions()

  // `loading` is, actually `!transactions`
  // added the `transaction` verification to prevent `Object is possibly 'undefined'` error
  if (loading || !transactions) {
    return (
      <Centered>
        <Loader size="md" />
      </Centered>
    )
  }

  if (count === 0) {
    // TODO: add `Transactions will appear here` image
    return <div>Transactions will appear here</div>
  }

  return (
    <TxActionProvider>
      <ScrollableTransactionsContainer id={SCROLLABLE_TARGET_ID}>
        <InfiniteScroll dataLength={count} next={next} hasMore={hasMore}>
          {/* Next list */}
          <TxLocationContext.Provider value={{ txLocation: 'queued.next' }}>
            {transactions.next.count !== 0 && <QueueTxList transactions={transactions.next.transactions} />}
          </TxLocationContext.Provider>

          {/* Queue list */}
          <TxLocationContext.Provider value={{ txLocation: 'queued.queued' }}>
            {transactions.queue.count !== 0 && <QueueTxList transactions={transactions.queue.transactions} />}
          </TxLocationContext.Provider>
        </InfiniteScroll>
      </ScrollableTransactionsContainer>
      <ActionModal />
    </TxActionProvider>
  )
}
