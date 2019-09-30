// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import Bold from '~/components/layout/Bold'
import EtherscanLink from '~/components/EtherscanLink'
import Paragraph from '~/components/layout/Paragraph'
import Block from '~/components/layout/Block'
import { md, lg } from '~/theme/variables'
import { getTxData } from './utils'

export const TRANSACTIONS_DESC_ADD_OWNER_TEST_ID = 'tx-description-add-owner'
export const TRANSACTIONS_DESC_REMOVE_OWNER_TEST_ID = 'tx-description-remove-owner'
export const TRANSACTIONS_DESC_CHANGE_THRESHOLD_TEST_ID = 'tx-description-change-threshold'
export const TRANSACTIONS_DESC_SEND_TEST_ID = 'tx-description-send'
export const TRANSACTIONS_DESC_CUSTOM_VALUE_TEST_ID = 'tx-description-custom-value'
export const TRANSACTIONS_DESC_CUSTOM_DATA_TEST_ID = 'tx-description-custom-data'

export const styles = () => ({
  txDataContainer: {
    padding: `${lg} ${md}`,
  },
  txData: {
    wordBreak: 'break-all',
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

type CustomDescProps = {
  value: string,
  recipient: string,
  data: String,
  classes: Obeject,
}

const TransferDescription = ({ value = '', symbol, recipient }: TransferDescProps) => (
  <Paragraph noMargin data-testid={TRANSACTIONS_DESC_SEND_TEST_ID}>
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
      <Paragraph data-testid={TRANSACTIONS_DESC_REMOVE_OWNER_TEST_ID}>
        <Bold>Remove owner:</Bold>
        <br />
        <EtherscanLink type="address" value={removedOwner} />
      </Paragraph>
    )}
    {addedOwner && (
      <Paragraph data-testid={TRANSACTIONS_DESC_ADD_OWNER_TEST_ID}>
        <Bold>Add owner:</Bold>
        <br />
        <EtherscanLink type="address" value={addedOwner} />
      </Paragraph>
    )}
    {newThreshold && (
      <Paragraph data-testid={TRANSACTIONS_DESC_CHANGE_THRESHOLD_TEST_ID}>
        <Bold>Change required confirmations:</Bold>
        <br />
        {newThreshold}
      </Paragraph>
    )}
  </>
)

const CustomDescription = ({
  data, value = 0, recipient, classes,
}: CustomDescProps) => (
  <>
    <Paragraph noMargin data-testid={TRANSACTIONS_DESC_CUSTOM_VALUE_TEST_ID}>
      <Bold>
        Send
        {' '}
        {value}
        {' '}
        ETH
        {' '}
        to:
      </Bold>
      <br />
      <EtherscanLink type="address" value={recipient} />
    </Paragraph>
    <Paragraph className={classes.txData} data-testid={TRANSACTIONS_DESC_CUSTOM_DATA_TEST_ID}>
      <Bold>Data (hex encoded):</Bold>
      <br />
      {data}
    </Paragraph>
  </>
)

const TxDescription = ({ tx, classes }: Props) => {
  const {
    recipient, value, modifySettingsTx, removedOwner, addedOwner, newThreshold, cancellationTx, customTx, data,
  } = getTxData(tx)

  return (
    <Block className={classes.txDataContainer}>
      {modifySettingsTx && (
        <SettingsDescription removedOwner={removedOwner} newThreshold={newThreshold} addedOwner={addedOwner} />
      )}
      {customTx && (
        <CustomDescription data={data} value={value} recipient={recipient} classes={classes} />
      )}
      {!cancellationTx && !modifySettingsTx && !customTx && (
        <TransferDescription value={value} symbol={tx.symbol} recipient={recipient} />
      )}
    </Block>
  )
}

export default withStyles(styles)(TxDescription)
