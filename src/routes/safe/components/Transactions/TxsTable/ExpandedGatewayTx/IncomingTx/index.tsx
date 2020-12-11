import React, { ReactElement } from 'react'

import { TransactionSummary, Transfer } from 'src/logic/safe/store/models/types/gateway'
import { IncomingTxDetails } from './IncomingTxDetails'
import { IncomingTxSummary } from './IncomingTxSummary'

export const IncomingTx = ({ transaction }: { transaction: TransactionSummary }): ReactElement => (
  <>
    <IncomingTxSummary transaction={transaction} />
    <IncomingTxDetails txInfo={transaction.txInfo as Transfer} />
  </>
)
