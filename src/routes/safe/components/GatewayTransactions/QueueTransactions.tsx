import React, { ReactElement } from 'react'
import { ActionModal } from 'src/routes/safe/components/GatewayTransactions/ActionModal'
import { TxActionProvider } from 'src/routes/safe/components/GatewayTransactions/TxActionProvider'
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
        {next.count !== 0 && <QueueTxList txLocation="queued.next" transactions={next.transactions} />}
        {queue.count !== 0 && <QueueTxList txLocation="queued.queued" transactions={queue.transactions} />}
      </ScrollableTransactionsContainer>
      <ActionModal />
    </TxActionProvider>
  )
}

