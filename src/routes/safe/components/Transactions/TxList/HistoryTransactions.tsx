import { Loader, Title } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'

import { usePagedHistoryTransactions } from './hooks/usePagedHistoryTransactions'
import { Centered, NoTransactions } from './styled'
import { HistoryTxList } from './HistoryTxList'
import { TxsInfiniteScroll } from './TxsInfiniteScroll'
import Img from 'src/components/layout/Img'
import NoTransactionsImage from './assets/no-transactions.svg'
import Filter, { FILTER_TYPE_FIELD_NAME } from './Filter'
import { useLocation } from 'react-router-dom'

export const HistoryTransactions = (): ReactElement => {
  const { count, next, transactions, isLoading } = usePagedHistoryTransactions()
  const { search } = useLocation()
  const isFiltered = search.includes(`${FILTER_TYPE_FIELD_NAME}=`)

  if (count === 0 && isLoading) {
    return (
      <Centered>
        <Loader size="md" />
      </Centered>
    )
  }

  return (
    <>
      <Filter />
      {count === 0 || !transactions.length ? (
        <NoTransactions>
          <Img alt="No Transactions yet" src={NoTransactionsImage} />
          <Title size="xs">{isFiltered ? 'No results found' : 'History transactions will appear here'} </Title>
        </NoTransactions>
      ) : (
        <TxsInfiniteScroll next={next} isLoading={isLoading}>
          <HistoryTxList transactions={transactions} />
        </TxsInfiniteScroll>
      )}
    </>
  )
}
