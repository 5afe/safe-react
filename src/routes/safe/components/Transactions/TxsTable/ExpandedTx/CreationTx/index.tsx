import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { AddressInfo } from '@gnosis.pm/safe-react-components'
import { getNetwork } from 'src/config'

import { Transaction } from 'src/routes/safe/store/models/types/transaction'
import { formatDate } from 'src/routes/safe/components/Transactions/TxsTable/columns'
import Bold from 'src/components/layout/Bold'
import Paragraph from 'src/components/layout/Paragraph'
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

type Props = {
  tx: Transaction
}

export const CreationTx = ({ tx }: Props): React.ReactElement => {
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
        {tx.creator ? (
          <AddressInfo address={tx.creator} shortenAddress={4} showCopyBtn showEtherscanBtn network={getNetwork()} />
        ) : (
          'n/a'
        )}
      </Block>
      <Block align="left" className={classes.txData}>
        <Bold className={classes.txHash}>Factory:</Bold>
        {tx.factoryAddress ? (
          <AddressInfo
            address={tx.factoryAddress}
            shortenAddress={4}
            showCopyBtn
            showEtherscanBtn
            network={getNetwork()}
          />
        ) : (
          'n/a'
        )}
      </Block>
      <Block align="left" className={classes.txData}>
        <Bold className={classes.txHash}>Mastercopy:</Bold>
        {tx.masterCopy ? (
          <AddressInfo address={tx.masterCopy} shortenAddress={4} showCopyBtn showEtherscanBtn network={getNetwork()} />
        ) : (
          'n/a'
        )}
      </Block>
    </>
  ) : null
}
