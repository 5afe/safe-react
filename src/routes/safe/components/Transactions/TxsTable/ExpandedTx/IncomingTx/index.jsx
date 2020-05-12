// @flow
import React from 'react'

import Bold from '~/components/layout/Bold'
import Paragraph from '~/components/layout/Paragraph'
import { formatDate } from '~/routes/safe/components/Transactions/TxsTable/columns'
import { INCOMING_TX_TYPES } from '~/routes/safe/store/models/incomingTransaction'
import type { Transaction } from '~/routes/safe/store/models/transaction'

type Props = {
  tx: Transaction,
}

export const IncomingTx = (props: Props) => {
  const { tx } = props
  if (!tx) return null
  const isIncomingTx = !!INCOMING_TX_TYPES[tx.type]
  return !isIncomingTx ? null : (
    <>
      <Paragraph noMargin>
        <Bold>Created: </Bold>
        {formatDate(tx.executionDate)}
      </Paragraph>
    </>
  )
}
