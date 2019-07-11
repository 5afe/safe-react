// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import OpenInNew from '@material-ui/icons/OpenInNew'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import Bold from '~/components/layout/Bold'
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

type AddressLinkProps = {
  address: string
}

const RinkebyAddressLink = ({ address }: AddressLinkProps) => (
  <a href={getEtherScanLink(address, 'rinkeby')} target="_blank" rel="noopener noreferrer">
    {shortVersionOf(address, 4)}
    <OpenInNew style={openIconStyle} />
  </a>
)

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
    <RinkebyAddressLink address={recipient} />
  </Paragraph>
)

const SettingsDescription = ({ removedOwner, addedOwner, newThreshold }: DescriptionDescProps) => (
  <>
    {newThreshold && (
      <Paragraph>
        <Bold>Change required confirmations:</Bold>
        <br />
        {newThreshold}
      </Paragraph>
    )}
    {removedOwner && (
      <Paragraph>
        <Bold>Remove owner:</Bold>
        <br />
        <RinkebyAddressLink address={removedOwner} />
      </Paragraph>
    )}
    {addedOwner && (
      <Paragraph>
        <Bold>Add owner:</Bold>
        <br />
        <RinkebyAddressLink address={addedOwner} />
      </Paragraph>
    )}
  </>
)

const TxDescription = ({ tx, classes }: Props) => {
  const {
    recipient, value, modifySettingsTx, removedOwner, addedOwner, newThreshold,
  } = getTxData(tx)

  return (
    <Block className={classes.txDataContainer}>
      {modifySettingsTx ? (
        <SettingsDescription removedOwner={removedOwner} newThreshold={newThreshold} addedOwner={addedOwner} />
      ) : (
        <TransferDescription value={value} symbol={tx.symbol} recipient={recipient} />
      )}
    </Block>
  )
}

export default withStyles(styles)(TxDescription)
