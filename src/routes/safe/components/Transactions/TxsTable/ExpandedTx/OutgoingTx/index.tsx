import React from 'react'

import { formatDate } from 'src/routes/safe/components/Transactions/TxsTable/columns'
import Bold from 'src/components/layout/Bold'
import Paragraph from 'src/components/layout/Paragraph'

export const OutgoingTx = (props) => {
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
