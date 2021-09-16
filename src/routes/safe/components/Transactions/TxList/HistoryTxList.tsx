import { ReactElement, useContext } from 'react'

import { TransactionDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { TxsInfiniteScrollContext } from 'src/routes/safe/components/Transactions/TxList/TxsInfiniteScroll'
import { formatWithSchema } from 'src/utils/date'
import { sameString } from 'src/utils/strings'
import { StyledTransactions, StyledTransactionsGroup, SubTitle } from './styled'
import { TxHistoryRow } from './TxHistoryRow'
import { TxLocationContext } from './TxLocationProvider'

export const HistoryTxList = ({ transactions }: { transactions: TransactionDetails['transactions'] }): ReactElement => {
  const { lastItemId, setLastItemId } = useContext(TxsInfiniteScrollContext)

  const [, lastTransactionsGroup] = transactions[transactions.length - 1]
  const lastTransaction = lastTransactionsGroup[lastTransactionsGroup.length - 1]

  if (!sameString(lastItemId, lastTransaction.id)) {
    setLastItemId(lastTransaction.id)
  }

  return (
    <TxLocationContext.Provider value={{ txLocation: 'history' }}>
      {transactions?.map(([timestamp, txs]) => (
        <StyledTransactionsGroup key={timestamp}>
          <SubTitle size="lg">{formatWithSchema(Number(timestamp), 'MMM d, yyyy')}</SubTitle>
          <StyledTransactions>
            {txs.map((transaction) => (
              <TxHistoryRow key={transaction.id} transaction={transaction} />
            ))}
          </StyledTransactions>
        </StyledTransactionsGroup>
      ))}
    </TxLocationContext.Provider>
  )
}
