import React, { ReactElement, useContext } from 'react'

import { TransactionDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { formatWithSchema } from 'src/utils/date'
import { StyledTransactions, StyledTransactionsGroup, SubTitle } from './styled'
import { TxHistoryRow } from './TxHistoryRow'
import { TxLocationContext } from './TxLocationProvider'
import { TxsInfiniteScrollContext } from './TxsInfiniteScroll'

export const HistoryTxList = ({ transactions }: { transactions: TransactionDetails['transactions'] }): ReactElement => {
  const { setLastItemId } = useContext(TxsInfiniteScrollContext)

  return (
    <TxLocationContext.Provider value={{ txLocation: 'history' }}>
      {transactions?.map(([timestamp, txs]) => (
        <StyledTransactionsGroup key={timestamp}>
          <SubTitle size="lg">{formatWithSchema(Number(timestamp), 'MMM d, yyyy')}</SubTitle>
          <StyledTransactions>
            {txs.map((transaction, index) => {
              if (txs.length === index + 1) {
                setLastItemId(transaction.id)
              }
              return <TxHistoryRow key={transaction.id} transaction={transaction} />
            })}
          </StyledTransactions>
        </StyledTransactionsGroup>
      ))}
    </TxLocationContext.Provider>
  )
}
