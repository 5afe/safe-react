import React, { ReactElement } from 'react'

import { ActionModal } from './ActionModal'
import { TxActionProvider } from './TxActionProvider'
import { TxLocationContext } from './TxLocationProvider'
import { useQueueTransactions } from './hooks/useQueueTransactions'
import { QueueTxList } from './QueueTxList'
import { ScrollableTransactionsContainer } from './styled'

export const QueueTransactions = (): ReactElement => {
  const { next, queue } = useQueueTransactions()
  const totalTransactions = next.count + queue.count

  return totalTransactions === 0 ? (
    <div>No txs</div>
  ) : (
    <TxActionProvider>
      <ScrollableTransactionsContainer>
        <TxLocationContext.Provider value={{ txLocation: 'queued.next' }}>
          {next.count !== 0 && <QueueTxList transactions={next.transactions} />}
        </TxLocationContext.Provider>
        <TxLocationContext.Provider value={{ txLocation: 'queued.queued' }}>
          {queue.count !== 0 && <QueueTxList transactions={queue.transactions} />}
        </TxLocationContext.Provider>
      </ScrollableTransactionsContainer>
      <ActionModal />
    </TxActionProvider>
  )
}
