import { Loader } from '@gnosis.pm/safe-react-components'
import { format } from 'date-fns'
import React, { ReactElement } from 'react'

import { InfiniteScroll, SCROLLABLE_TARGET_ID } from 'src/components/InfiniteScroll'
import { usePagedHistoryTransactions } from './hooks/usePagedHistoryTransactions'
import { H2, ScrollableTransactionsContainer, StyledTransactions, StyledTransactionsGroup } from './styled'
import { TxHistoryRow } from './TxHistoryRow'

export const HistoryTxList = (): ReactElement => {
  const { count, hasMore, next, transactions } = usePagedHistoryTransactions()

  if (count === 0) {
    return <Loader size="lg" />
  }

  return (
    <ScrollableTransactionsContainer id={SCROLLABLE_TARGET_ID}>
      <InfiniteScroll dataLength={transactions.length} next={next} hasMore={hasMore}>
        {transactions?.map(([timestamp, txs]) => (
          <StyledTransactionsGroup key={timestamp}>
            <H2>{format(Number(timestamp), 'MMM d, yyyy')}</H2>
            <StyledTransactions>
              {txs.map((transaction) => (
                <TxHistoryRow key={transaction.id} transaction={transaction} />
              ))}
            </StyledTransactions>
          </StyledTransactionsGroup>
        ))}
      </InfiniteScroll>
    </ScrollableTransactionsContainer>
  )
}
