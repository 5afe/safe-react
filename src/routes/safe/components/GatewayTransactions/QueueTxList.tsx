import React, { ReactElement } from 'react'

import { TransactionDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { TxQueueRow } from 'src/routes/safe/components/GatewayTransactions/TxQueueRow'
import { H2, StyledTransactions, StyledTransactionsGroup } from './styled'

type QueueTxListProps = {
  txLocation: 'queued.next' | 'queued.queued'
  transactions: TransactionDetails['transactions']
}

export const QueueTxList = ({ txLocation, transactions }: QueueTxListProps): ReactElement => {
  const title = txLocation === 'queued.next' ? 'Next Transaction' : 'Queue'

  return (
    <StyledTransactionsGroup>
      <H2>{title}</H2>
      <StyledTransactions>
        {transactions.map(([nonce, txs]) =>
          txs.map((transaction) => (
            <TxQueueRow key={`${nonce}-${transaction.id}`} transaction={transaction} txLocation={txLocation} />
          )),
        )}
      </StyledTransactions>
    </StyledTransactionsGroup>
  )
}
