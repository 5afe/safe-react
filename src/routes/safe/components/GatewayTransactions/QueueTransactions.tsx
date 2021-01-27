import React, { ReactElement } from 'react'

import { InfiniteScroll, SCROLLABLE_TARGET_ID } from 'src/components/InfiniteScroll'
import { usePagedQueuedTransactions } from './hooks/usePagedQueuedTransactions'
import { ActionModal } from './ActionModal'
import { TxActionProvider } from './TxActionProvider'
import { TxLocationContext } from './TxLocationProvider'
import { QueueTxList } from './QueueTxList'
import { ScrollableTransactionsContainer } from './styled'

export const QueueTransactions = (): ReactElement => {
  const { count, hasMore, next, transactions } = usePagedQueuedTransactions()

  return count === 0 ? (
    <div>No txs</div>
  ) : (
    <TxActionProvider>
      <ScrollableTransactionsContainer id={SCROLLABLE_TARGET_ID}>
        <InfiniteScroll dataLength={count} next={next} hasMore={hasMore}>
          <TxLocationContext.Provider value={{ txLocation: 'queued.next' }}>
            {transactions.next.count !== 0 && <QueueTxList transactions={transactions.next.transactions} />}
          </TxLocationContext.Provider>
          <TxLocationContext.Provider value={{ txLocation: 'queued.queued' }}>
            {transactions.queue.count !== 0 && <QueueTxList transactions={transactions.queue.transactions} />}
          </TxLocationContext.Provider>
        </InfiniteScroll>
      </ScrollableTransactionsContainer>
      <ActionModal />
    </TxActionProvider>
  )
}
