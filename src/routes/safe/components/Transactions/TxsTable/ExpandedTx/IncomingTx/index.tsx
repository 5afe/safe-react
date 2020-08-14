import React from 'react'
import { INCOMING_TX_TYPES } from 'src/logic/safe/store/models/incomingTransaction'
import { formatDate } from 'src/routes/safe/components/Transactions/TxsTable/columns'
import Bold from 'src/components/layout/Bold'
import Paragraph from 'src/components/layout/Paragraph'

export const IncomingTx = ({ tx }) => {
  if (!tx) {
    return null
  }

  const isIncomingTx = !!INCOMING_TX_TYPES[tx.type]

  return isIncomingTx ? (
    <Paragraph noMargin>
      <Bold>Created: </Bold>
      {formatDate(tx.executionDate)}
    </Paragraph>
  ) : null
}
