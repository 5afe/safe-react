import { Loader, Title } from '@gnosis.pm/safe-react-components'
import { ReactElement, useEffect, useMemo } from 'react'

import Img from 'src/components/layout/Img'
import NoTransactionsImage from './assets/no-transactions.svg'
import { usePagedQueuedTransactions } from './hooks/usePagedQueuedTransactions'
import { QueueTxList } from './QueueTxList'
import { Centered, NoTransactions } from './styled'
import { TxsInfiniteScroll } from './TxsInfiniteScroll'
import { TxLocationContext } from './TxLocationProvider'
import { trackEventMemoized } from 'src/utils/googleTagManager'
import { TX_LIST_EVENTS } from 'src/utils/events/txList'
import { useSelector } from 'react-redux'
import { currentChainId } from 'src/logic/config/store/selectors'
import { currentSafe } from 'src/logic/safe/store/selectors'

export const QueueTransactions = (): ReactElement => {
  const { count, isLoading, hasMore, next, transactions } = usePagedQueuedTransactions()
  const chainId = useSelector(currentChainId)
  const { address } = useSelector(currentSafe)

  const queuedTxCount = useMemo(
    () => (transactions ? transactions.next.count + transactions.queue.count : 0),
    [transactions],
  )
  useEffect(() => {
    trackEventMemoized(
      {
        ...TX_LIST_EVENTS.QUEUED_TXS,
        label: queuedTxCount,
      },
      chainId,
      address,
    )
  }, [queuedTxCount, chainId, address])

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
        <Title size="xs">Queue transactions will appear here </Title>
      </NoTransactions>
    )
  }

  return (
    <TxsInfiniteScroll next={next} hasMore={hasMore} isLoading={isLoading}>
      {/* Next list */}
      <TxLocationContext.Provider value={{ txLocation: 'queued.next' }}>
        {transactions.next.count !== 0 && <QueueTxList transactions={transactions.next.transactions} />}
      </TxLocationContext.Provider>

      {/* Queue list */}
      <TxLocationContext.Provider value={{ txLocation: 'queued.queued' }}>
        {transactions.queue.count !== 0 && <QueueTxList transactions={transactions.queue.transactions} />}
      </TxLocationContext.Provider>
    </TxsInfiniteScroll>
  )
}
