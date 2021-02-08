import { Loader, Title } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
import style from 'styled-components'

import { InfiniteScroll, SCROLLABLE_TARGET_ID } from 'src/components/InfiniteScroll'
import Img from 'src/components/layout/Img'
import { usePagedQueuedTransactions } from './hooks/usePagedQueuedTransactions'
import { ActionModal } from './ActionModal'
import { TxActionProvider } from './TxActionProvider'
import { TxLocationContext } from './TxLocationProvider'
import { QueueTxList } from './QueueTxList'
import { ScrollableTransactionsContainer, Centered } from './styled'
import NoTransactionsImage from './assets/no-transactions.svg'

const NoTransactions = style.div`
  display: flex;
  flex-direction: column;
  margin-top: 60px;
`

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
    return (
      <NoTransactions>
        <Img alt="No Transactions yet" src={NoTransactionsImage} />
        <Title size="xs">Transactions will appear here </Title>
      </NoTransactions>
    )
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
