import React, { ReactElement } from 'react'

import { useQueueTransactions } from './hooks/useQueueTransactions'
import { QueueTxList } from './QueueTxList'

export const QueueTransactions = (): ReactElement => {
  const { next, queue } = useQueueTransactions()

  return next.count + queue.count === 0 ? (
    <div>No txs</div>
  ) : (
    <>
      {next.count !== 0 && <QueueTxList title="Next Transaction" transactions={next.transactions} />}
      {queue.count !== 0 && <QueueTxList title="Queue" transactions={queue.transactions} />}
    </>
  )
}
