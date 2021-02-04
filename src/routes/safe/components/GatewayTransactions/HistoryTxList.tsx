import { Loader } from '@gnosis.pm/safe-react-components'
import { format } from 'date-fns'
import React, { ReactElement } from 'react'

import { InfiniteScroll, SCROLLABLE_TARGET_ID } from 'src/components/InfiniteScroll'
import { usePagedHistoryTransactions } from './hooks/usePagedHistoryTransactions'
import {
  SubTitle,
  ScrollableTransactionsContainer,
  StyledTransactions,
  StyledTransactionsGroup,
  Centered,
} from './styled'
import { TxHistoryRow } from './TxHistoryRow'
import { TxLocationContext } from './TxLocationProvider'

export const HistoryTxList = (): ReactElement => {
  const { count, hasMore, next, transactions } = usePagedHistoryTransactions()

  if (count === 0) {
    return (
      <Centered>
        <Loader size="md" />
      </Centered>
    )
  }

  return (
    <TxLocationContext.Provider value={{ txLocation: 'history' }}>
      <ScrollableTransactionsContainer id={SCROLLABLE_TARGET_ID}>
        <InfiniteScroll dataLength={transactions.length} next={next} hasMore={hasMore}>
          {transactions?.map(([timestamp, txs]) => (
            <StyledTransactionsGroup key={timestamp}>
              <SubTitle size="lg">{format(Number(timestamp), 'MMM d, yyyy')}</SubTitle>
              <StyledTransactions>
                {txs.map((transaction) => (
                  <TxHistoryRow key={transaction.id} transaction={transaction} />
                ))}
              </StyledTransactions>
            </StyledTransactionsGroup>
          ))}
        </InfiniteScroll>
      </ScrollableTransactionsContainer>
    </TxLocationContext.Provider>
  )
}
