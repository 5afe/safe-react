// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import OpenInNew from '@material-ui/icons/OpenInNew'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import Bold from '~/components/layout/Bold'
import AddressLink from '~/components/AddressLink'
import Paragraph from '~/components/layout/Paragraph'
import Block from '~/components/layout/Block'
import { getEtherScanLink } from '~/logic/wallets/getWeb3'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'
import { md, lg, secondary } from '~/theme/variables'
import { getTxData } from './utils'

const openIconStyle = {
  height: '13px',
  color: secondary,
}

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
    <AddressLink address={recipient} />
  </Paragraph>
)

const SettingsDescription = ({ removedOwner, addedOwner, newThreshold }: DescriptionDescProps) => (
  <>
    {removedOwner && (
      <Paragraph>
        <Bold>Remove owner:</Bold>
        <br />
        <AddressLink address={removedOwner} />
      </Paragraph>
    )}
    {addedOwner && (
      <Paragraph>
        <Bold>Add owner:</Bold>
        <br />
        <AddressLink address={addedOwner} />
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
