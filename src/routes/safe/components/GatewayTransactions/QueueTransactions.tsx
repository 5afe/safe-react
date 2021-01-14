import React, { ReactElement } from 'react'

import { ScrollableTransactionsContainer } from 'src/routes/safe/components/GatewayTransactions/styled'
import { useQueueTransactions } from './hooks/useQueueTransactions'
import { QueueTxList } from './QueueTxList'

export const QueueTransactions = (): ReactElement => {
  const { next, queue } = useQueueTransactions()
  const totalTransactions = next.count + queue.count

  return totalTransactions === 0 ? (
    <div>No txs</div>
  ) : (
    <ScrollableTransactionsContainer>
      {next.count !== 0 && <QueueTxList txLocation="queued.next" transactions={next.transactions} />}
      {queue.count !== 0 && <QueueTxList txLocation="queued.queued" transactions={queue.transactions} />}
    </ScrollableTransactionsContainer>
  )
}
