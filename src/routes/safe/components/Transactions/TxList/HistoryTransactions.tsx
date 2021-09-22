import { Loader, Title } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'

import { usePagedHistoryTransactions } from './hooks/usePagedHistoryTransactions'
import { Centered, NoTransactions } from './styled'
import { HistoryTxList } from './HistoryTxList'
import { TxsInfiniteScroll } from './TxsInfiniteScroll'
import Img from 'src/components/layout/Img'
import NoTransactionsImage from './assets/no-transactions.svg'

export const HistoryTransactions = (): ReactElement => {
  const { count, hasMore, next, transactions, isLoading } = usePagedHistoryTransactions()

  if (count === 0 && isLoading) {
    return (
      <Centered>
        <Loader size="md" />
      </Centered>
    )
  }

  if (count === 0 || !transactions.length) {
    return (
      <NoTransactions>
        <Img alt="No Transactions yet" src={NoTransactionsImage} />
        <Title size="xs">History transactions will appear here </Title>
      </NoTransactions>
    )
  }

  return (
    <TxsInfiniteScroll next={next} hasMore={hasMore} isLoading={isLoading}>
      <HistoryTxList transactions={transactions} />
    </TxsInfiniteScroll>
  )
}
