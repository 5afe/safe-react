import { Loader } from '@gnosis.pm/safe-react-components'
import { format } from 'date-fns'
import React, { ReactElement, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { loadPagedTransactions } from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadGatewayTransactions'
import { addHistoryTransactions } from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { useHistoryTransactions } from './hooks/useHistoryTransactions'
import { H2, StyledTransactions, StyledTransactionsGroup } from './styled'
import { TxRow } from './TxRow'

const usePagedTransactions = () => {
  const { count, transactions } = useHistoryTransactions()

  const dispatch = useDispatch()
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const [hasMore, setHasMore] = useState(true)

  const fetchMoreData = async () => {
    const values = await loadPagedTransactions(safeAddress)

    if (values) {
      dispatch(addHistoryTransactions({ safeAddress, values }))
    } else {
      setHasMore(false)
    }
  }

  return { count, transactions, hasMore, fetchMoreData }
}

const ScrollableContainer = styled.div`
  height: calc(100vh - 225px);
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`

export const HistoryTxList = (): ReactElement => {
  const { count, fetchMoreData, hasMore, transactions } = usePagedTransactions()

  if (count === 0) {
    return <Loader size="lg" />
  }

  return (
    <ScrollableContainer id="scrollableDiv">
      <InfiniteScroll
        style={{ overflow: 'hidden' }}
        dataLength={transactions.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<Loader size="md" />}
        endMessage="all set"
        scrollThreshold="120px"
        scrollableTarget="scrollableDiv"
      >
        {transactions?.map(([timestamp, txs]) => (
          <StyledTransactionsGroup key={timestamp}>
            <H2>{format(Number(timestamp), 'MMM d, yyyy')}</H2>
            <StyledTransactions>
              {txs.map((transaction) => (
                <TxRow key={transaction.id} transaction={transaction} />
              ))}
            </StyledTransactions>
          </StyledTransactionsGroup>
        ))}
      </InfiniteScroll>
    </ScrollableContainer>
  )
}
