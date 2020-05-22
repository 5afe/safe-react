// @flow
import React from 'react'
import { formatDate } from '../../columns'
import Bold from '../../../../../../../components/layout/Bold'
import Paragraph from '../../../../../../../components/layout/Paragraph'

export const CreationTx = (props) => {
  const { tx } = props
  if (!tx) return null
  const isCreationTx = tx.type === 'creation'

  return !isCreationTx ? null : (
    <>
      <Paragraph noMargin>
        <Bold>Created: </Bold>
        {formatDate(tx.created)}
      </Paragraph>
      <Paragraph noMargin>
        <Bold>Creator: </Bold>
        {tx.creator}
      </Paragraph>
      <Paragraph noMargin>
        <Bold>Factory: </Bold>
        {tx.factoryAddress}
      </Paragraph>
      <Paragraph noMargin>
        <Bold>Mastercopy: </Bold>
        {tx.masterCopy}
      </Paragraph>
    </>
  )
}
