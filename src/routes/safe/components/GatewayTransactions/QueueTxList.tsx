import React, { ReactElement } from 'react'

import { TransactionDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { H2 } from './styled'

type QueueTxListProps = {
  title: string
  transactions: TransactionDetails['transactions']
}

export const QueueTxList = ({ title, transactions }: QueueTxListProps): ReactElement => (
  <>
    <H2>{title}</H2>
    {transactions.map(([nonce, txs]) => (
      <React.Fragment key={nonce}>
        {txs.length === 1 ? (
          <div>{JSON.stringify(txs[0])}</div>
        ) : (
          txs.map((transaction) => <div key={transaction.id}>{JSON.stringify(transaction)}</div>)
        )}
      </React.Fragment>
    ))}
  </>
)
