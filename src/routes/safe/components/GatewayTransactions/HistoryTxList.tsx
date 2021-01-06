import { Loader } from '@gnosis.pm/safe-react-components'
import { format } from 'date-fns'
import React, { ReactElement } from 'react'

import { useHistoryTransactions } from './hooks/useHistoryTransactions'
import { H2, StyledTransactions, StyledTransactionsGroup } from './styled'
import { TxRow } from './TxRow'

export const HistoryTxList = (): ReactElement => {
  const { count, transactions } = useHistoryTransactions()

  if (count === 0) {
    return <Loader size="lg" />
  }

  return (
    <>
      {transactions.map(([timestamp, txs]) => (
        <StyledTransactionsGroup key={timestamp}>
          <H2>{format(Number(timestamp), 'MMM d, yyyy')}</H2>
          <StyledTransactions>
            {txs.map((transaction) => (
              <TxRow key={transaction.id} transaction={transaction} />
            ))}
          </StyledTransactions>
        </StyledTransactionsGroup>
      ))}
    </>
  )
}
