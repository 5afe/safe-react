// @flow
import React from 'react'

import Bold from '~/components/layout/Bold'
import Paragraph from '~/components/layout/Paragraph'
import { formatDate } from '~/routes/safe/components/Transactions/TxsTable/columns'
import type { Transaction } from '~/routes/safe/store/models/transaction'

type Props = {
  tx: Transaction,
}

export const OutgoingTx = (props: Props) => {
  const { tx } = props
  if (!tx || !(tx.type === 'outgoing')) return null
  return (
    <>
      <Paragraph noMargin>
        <Bold>Created: </Bold>
        {formatDate(tx.submissionDate)}
      </Paragraph>
      {tx.executionDate && (
        <Paragraph noMargin>
          <Bold>Executed: </Bold>
          {formatDate(tx.executionDate)}
        </Paragraph>
      )}
      {tx.refundParams && (
        <Paragraph noMargin>
          <Bold>Refund: </Bold>
          max. {tx.refundParams.fee} {tx.refundParams.symbol}
        </Paragraph>
      )}
      {tx.operation === 1 && (
        <Paragraph noMargin>
          <Bold>Delegate Call</Bold>
        </Paragraph>
      )}
      {tx.operation === 2 && (
        <Paragraph noMargin>
          <Bold>Contract Creation</Bold>
        </Paragraph>
      )}
    </>
  )
}
