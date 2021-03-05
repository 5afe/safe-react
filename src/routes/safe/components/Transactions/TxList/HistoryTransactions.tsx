import { Loader } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'

import { usePagedHistoryTransactions } from './hooks/usePagedHistoryTransactions'
import { Centered } from './styled'
import { HistoryTxList } from './HistoryTxList'
import { TxsInfiniteScroll } from './TxsInfiniteScroll'

export const HistoryTransactions = (): ReactElement => {
  const { count, hasMore, next, transactions, isLoading } = usePagedHistoryTransactions()

  if (count === 0) {
    return (
      <Centered>
        <Loader size="md" />
      </Centered>
    )
  }

  return (
    <TxsInfiniteScroll next={next} hasMore={hasMore} isLoading={isLoading}>
      <HistoryTxList transactions={transactions} />
    </TxsInfiniteScroll>
  )
}
