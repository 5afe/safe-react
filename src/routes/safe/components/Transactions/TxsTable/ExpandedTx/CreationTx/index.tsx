// @flow
import React from 'react'
import { formatDate } from '../../columns'
import Bold from '../../../../../../../components/layout/Bold'
import Paragraph from '../../../../../../../components/layout/Paragraph'
import EtherscanLink from '../../../../../../../components/EtherscanLink'
import { makeStyles } from '@material-ui/core/styles'
import Block from '../../../../../../../components/layout/Block'

const useStyles = makeStyles({
  address: {
    height: '20px',
  },
  txData: {
    alignItems: 'center',
    display: 'flex',
    lineHeight: '1.6',
  },
  txHash: {
    paddingRight: '3px',
  },
})

export const CreationTx = (props) => {
  const { tx } = props
  const classes = useStyles()
  if (!tx) return null
  const isCreationTx = tx.type === 'creation'

  console.log('Classes', classes)

  return !isCreationTx ? null : (
    <>
      <Paragraph noMargin>
        <Bold>Created: </Bold>
        {formatDate(tx.created)}
      </Paragraph>
      <Block align="left" className={classes.txData}>
        <Bold className={classes.txHash}>Creator:</Bold>
        {tx.creator ? <EtherscanLink cut={8} type="address" value={tx.creator} /> : 'n/a'}
      </Block>
      <Block align="left" className={classes.txData}>
        <Bold className={classes.txHash}>Factory:</Bold>
        {tx.factoryAddress ? <EtherscanLink cut={8} type="address" value={tx.factoryAddress} /> : 'n/a'}
      </Block>
      <Block align="left" className={classes.txData}>
        <Bold className={classes.txHash}>Mastercopy:</Bold>
        {tx.masterCopy ? <EtherscanLink cut={8} type="address" value={tx.masterCopy} /> : 'n/a'}
      </Block>
    </>
  )
}
