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
  classes: Object,
}

const TransferDescription = ({ value = '', symbol, recipient }: TransferDescProps) => (
  <Block data-testid={TRANSACTIONS_DESC_SEND_TEST_ID}>
    <Bold>
      Send
      {' '}
      {value}
      {' '}
      {symbol}
      {' '}
      to:
    </Bold>
    <EtherscanLink type="address" value={recipient} />
  </Block>
)

const SettingsDescription = ({ removedOwner, addedOwner, newThreshold }: DescriptionDescProps) => (
  <>
    {removedOwner && (
      <Block data-testid={TRANSACTIONS_DESC_REMOVE_OWNER_TEST_ID}>
        <Bold>Remove owner:</Bold>
        <EtherscanLink type="address" value={removedOwner} />
      </Block>
    )}
    {addedOwner && (
      <Block data-testid={TRANSACTIONS_DESC_ADD_OWNER_TEST_ID}>
        <Bold>Add owner:</Bold>
        <EtherscanLink type="address" value={addedOwner} />
      </Block>
    )}
    {newThreshold && (
      <Block data-testid={TRANSACTIONS_DESC_CHANGE_THRESHOLD_TEST_ID}>
        <Bold>Change required confirmations:</Bold>
        <Paragraph size="md" noMargin>
          {newThreshold}
        </Paragraph>
      </Block>
    )}
  </>
)

const CustomDescription = ({
  data, value = 0, recipient, classes,
}: CustomDescProps) => (
  <>
    <Block data-testid={TRANSACTIONS_DESC_CUSTOM_VALUE_TEST_ID}>
      <Bold>
        Send
        {' '}
        {value}
        {' '}
        ETH
        {' '}
        to:
      </Bold>
      <EtherscanLink type="address" value={recipient} />
    </Block>
    <Block className={classes.txData} data-testid={TRANSACTIONS_DESC_CUSTOM_DATA_TEST_ID}>
      <Bold>Data (hex encoded):</Bold>
      <Paragraph size="md" noMargin>
        {data}
      </Paragraph>
    </Block>
  </>
)

const TxDescription = ({ tx, classes }: Props) => {
  const {
    recipient, value, modifySettingsTx, removedOwner, addedOwner, newThreshold, cancellationTx, customTx, creationTx, data,
  } = getTxData(tx)
  return (
    <Block className={classes.txDataContainer}>
      {modifySettingsTx && (
        <SettingsDescription removedOwner={removedOwner} newThreshold={newThreshold} addedOwner={addedOwner} />
      )}
      {customTx && (
        <CustomDescription data={data} value={value} recipient={recipient} classes={classes} />
      )}
      {!cancellationTx && !modifySettingsTx && !customTx && !creationTx && (
        <TransferDescription value={value} symbol={tx.symbol} recipient={recipient} />
      )}
    </Block>
  )
}

export default withStyles(styles)(TxDescription)
