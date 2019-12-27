// @flow
import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { getTxAmount } from '~/routes/safe/components/Transactions/TxsTable/columns'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import Bold from '~/components/layout/Bold'
import EtherscanLink from '~/components/EtherscanLink'
import Paragraph from '~/components/layout/Paragraph'
import Block from '~/components/layout/Block'
import { md, lg } from '~/theme/variables'
import { getTxData } from './utils'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'
import LinkWithRef from '~/components/layout/Link'
import OwnerAddressTableCell from '~/routes/safe/components/Settings/ManageOwners/OwnerAddressTableCell'
import { getNameFromAddressBook } from '~/logic/addressBook/utils'

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
  txDataParagraph: {
    whiteSpace: 'normal',
  },
  linkTxData: {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
})

type Props = {
  classes: Object,
  tx: Transaction,
}

type TransferDescProps = {
  amount: string,
  recipient: string,
  recipientName?: string,
}

type DescriptionDescProps = {
  removedOwner?: string,
  addedOwner?: string,
  newThreshold?: string,
}

type CustomDescProps = {
  amount: string,
  recipient: string,
  data: String,
  classes: Object,
}

const TransferDescription = ({ amount = '', recipient, recipientName }: TransferDescProps) => (
  <Block data-testid={TRANSACTIONS_DESC_SEND_TEST_ID}>
    <Bold>
      Send
      {' '}
      {amount}
      {' '}
      to:
    </Bold>
    { recipientName ? <OwnerAddressTableCell address={recipient} showLinks userName={recipientName} /> : <EtherscanLink type="address" value={recipient} />}
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
  data, amount = 0, recipient, classes,
}: CustomDescProps) => {
  const [showTxData, setShowTxData] = useState(false)
  return (
    <>
      <Block data-testid={TRANSACTIONS_DESC_CUSTOM_VALUE_TEST_ID}>
        <Bold>
          Send
          {' '}
          {amount}
          {' '}
          to:
        </Bold>
        <EtherscanLink type="address" value={recipient} />
      </Block>
      <Block className={classes.txData} data-testid={TRANSACTIONS_DESC_CUSTOM_DATA_TEST_ID}>
        <Bold>Data (hex encoded):</Bold>
        <Paragraph size="md" noMargin className={classes.txDataParagraph}>
          {showTxData ? (
            <>
              {data}
              {' '}
              <LinkWithRef
                aria-label="Hide details of the transaction"
                onClick={() => setShowTxData(false)}
                rel="noopener noreferrer"
                target="_blank"
                className={classes.linkTxData}
              >
                Show Less
              </LinkWithRef>
            </>
          ) : (
            <>
              {shortVersionOf(data, 20)}
              {' '}
              <LinkWithRef
                aria-label="Show details of the transaction"
                onClick={() => setShowTxData(true)}
                rel="noopener noreferrer"
                target="_blank"
                className={classes.linkTxData}
              >
                Show More
              </LinkWithRef>
            </>
          )}
        </Paragraph>
      </Block>
    </>
  )
}

const TxDescription = ({ tx, classes }: Props) => {
  const {
    recipient,
    modifySettingsTx,
    removedOwner,
    addedOwner,
    newThreshold,
    cancellationTx,
    customTx,
    creationTx,
    data,
  } = getTxData(tx)
  const amount = getTxAmount(tx)
  const recipientName = getNameFromAddressBook(recipient)
  return (
    <Block className={classes.txDataContainer}>
      {modifySettingsTx && (
        <SettingsDescription removedOwner={removedOwner} newThreshold={newThreshold} addedOwner={addedOwner} />
      )}
      {customTx && (
        <CustomDescription data={data} amount={amount} recipient={recipient} classes={classes} />
      )}
      {!cancellationTx && !modifySettingsTx && !customTx && !creationTx && (
        <TransferDescription amount={amount} recipient={recipient} recipientName={recipientName} />
      )}
    </Block>
  )
}

export default withStyles(styles)(TxDescription)
