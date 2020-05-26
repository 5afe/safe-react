import React from 'react'
import { INCOMING_TX_TYPES } from '../../../../../store/models/incomingTransaction'
import { formatDate } from '../../columns'
import Bold from '../../../../../../../components/layout/Bold'
import Paragraph from '../../../../../../../components/layout/Paragraph'

export const IncomingTx = (props) => {
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
