import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

import { formatDate } from 'src/routes/safe/components/Transactions/TxsTable/columns'
import Bold from 'src/components/layout/Bold'
import Paragraph from 'src/components/layout/Paragraph'
import EtherscanLink from 'src/components/EtherscanLink'
import Block from 'src/components/layout/Block'
import { TransactionTypes } from 'src/routes/safe/store/models/types/transaction'

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

export const CreationTx = ({ tx }) => {
  const classes = useStyles()

  if (!tx) {
    return null
  }

  const isCreationTx = tx.type === TransactionTypes.CREATION

  return isCreationTx ? (
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
  ) : null
}
