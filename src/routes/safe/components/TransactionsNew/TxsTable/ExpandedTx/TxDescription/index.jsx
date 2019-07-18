// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import Bold from '~/components/layout/Bold'
import EtherscanLink from '~/components/EtherscanLink'
import Paragraph from '~/components/layout/Paragraph'
import Block from '~/components/layout/Block'
import { md, lg, secondary } from '~/theme/variables'
import { getTxData } from './utils'

export const styles = () => ({
  txDataContainer: {
    padding: `${lg} ${md}`,
  },
})

type Props = {
  classes: Object,
  tx: Transaction,
}

type TransferDescProps = {
  value: string,
  symbol: string,
  recipient: string,
}

type DescriptionDescProps = {
  removedOwner?: string,
  addedOwner?: string,
  newThreshold?: string,
}

const TransferDescription = ({ value = '', symbol, recipient }: TransferDescProps) => (
  <Paragraph noMargin>
    <Bold>
      Send
      {' '}
      {value}
      {' '}
      {symbol}
      {' '}
to:
    </Bold>
    <br />
    <EtherscanLink type="address" value={recipient} />
  </Paragraph>
)

const SettingsDescription = ({ removedOwner, addedOwner, newThreshold }: DescriptionDescProps) => (
  <>
    {removedOwner && (
      <Paragraph>
        <Bold>Remove owner:</Bold>
        <br />
        <EtherscanLink type="address" value={removedOwner} />
      </Paragraph>
    )}
    {addedOwner && (
      <Paragraph>
        <Bold>Add owner:</Bold>
        <br />
        <EtherscanLink type="address" value={addedOwner} />
      </Paragraph>
    )}
    {newThreshold && (
      <Paragraph>
        <Bold>Change required confirmations:</Bold>
        <br />
        {newThreshold}
      </Paragraph>
    )}
  </>
)

const TxDescription = ({ tx, classes }: Props) => {
  const {
    recipient, value, modifySettingsTx, removedOwner, addedOwner, newThreshold, cancellationTx,
  } = getTxData(tx)

  return (
    <Block className={classes.txDataContainer}>
      {modifySettingsTx && (
        <SettingsDescription removedOwner={removedOwner} newThreshold={newThreshold} addedOwner={addedOwner} />
      )}
      {!cancellationTx && !modifySettingsTx && (
        <TransferDescription value={value} symbol={tx.symbol} recipient={recipient} />
      )}
    </Block>
  )
}

export default withStyles(styles)(TxDescription)
