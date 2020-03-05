// @flow
import { withStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'

import { getTxData } from './utils'

import EtherscanLink from '~/components/EtherscanLink'
import Block from '~/components/layout/Block'
import Bold from '~/components/layout/Bold'
import LinkWithRef from '~/components/layout/Link'
import Paragraph from '~/components/layout/Paragraph'
import { getNameFromAddressBook } from '~/logic/addressBook/utils'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'
import OwnerAddressTableCell from '~/routes/safe/components/Settings/ManageOwners/OwnerAddressTableCell'
import { getTxAmount } from '~/routes/safe/components/Transactions/TxsTable/columns'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { lg, md } from '~/theme/variables'

export const TRANSACTIONS_DESC_ADD_OWNER_TEST_ID = 'tx-description-add-owner'
export const TRANSACTIONS_DESC_REMOVE_OWNER_TEST_ID = 'tx-description-remove-owner'
export const TRANSACTIONS_DESC_CHANGE_THRESHOLD_TEST_ID = 'tx-description-change-threshold'
export const TRANSACTIONS_DESC_SEND_TEST_ID = 'tx-description-send'
export const TRANSACTIONS_DESC_CUSTOM_VALUE_TEST_ID = 'tx-description-custom-value'
export const TRANSACTIONS_DESC_CUSTOM_DATA_TEST_ID = 'tx-description-custom-data'

export const styles = () => ({
  txDataContainer: {
    paddingTop: lg,
    paddingLeft: md,
    paddingBottom: md,
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
}

type DescriptionDescProps = {
  removedOwner?: string,
  addedOwner?: string,
  newThreshold?: string,
}

type CustomDescProps = {
  amount: string,
  recipient: string,
  data: string,
  classes: Object,
}

const TransferDescription = ({ amount = '', recipient }: TransferDescProps) => {
  const recipientName = getNameFromAddressBook(recipient)
  return (
    <Block data-testid={TRANSACTIONS_DESC_SEND_TEST_ID}>
      <Bold>Send {amount} to:</Bold>
      {recipientName ? (
        <OwnerAddressTableCell address={recipient} knownAddress showLinks userName={recipientName} />
      ) : (
        <EtherscanLink knownAddress={false} type="address" value={recipient} />
      )}
    </Block>
  )
}

const SettingsDescription = ({ addedOwner, newThreshold, removedOwner }: DescriptionDescProps) => {
  const ownerChangedName = removedOwner ? getNameFromAddressBook(removedOwner) : getNameFromAddressBook(addedOwner)
  return (
    <>
      {removedOwner && (
        <Block data-testid={TRANSACTIONS_DESC_REMOVE_OWNER_TEST_ID}>
          <Bold>Remove owner:</Bold>
          {ownerChangedName ? (
            <OwnerAddressTableCell address={removedOwner} knownAddress showLinks userName={ownerChangedName} />
          ) : (
            <EtherscanLink knownAddress={false} type="address" value={removedOwner} />
          )}
        </Block>
      )}
      {addedOwner && (
        <Block data-testid={TRANSACTIONS_DESC_ADD_OWNER_TEST_ID}>
          <Bold>Add owner:</Bold>
          {ownerChangedName ? (
            <OwnerAddressTableCell address={addedOwner} knownAddress showLinks userName={ownerChangedName} />
          ) : (
            <EtherscanLink knownAddress={false} type="address" value={addedOwner} />
          )}
        </Block>
      )}
      {newThreshold && (
        <Block data-testid={TRANSACTIONS_DESC_CHANGE_THRESHOLD_TEST_ID}>
          <Bold>Change required confirmations:</Bold>
          <Paragraph noMargin size="md">
            {newThreshold}
          </Paragraph>
        </Block>
      )}
    </>
  )
}

const CustomDescription = ({ amount = 0, classes, data, recipient }: CustomDescProps) => {
  const [showTxData, setShowTxData] = useState(false)
  const recipientName = getNameFromAddressBook(recipient)
  return (
    <>
      <Block data-testid={TRANSACTIONS_DESC_CUSTOM_VALUE_TEST_ID}>
        <Bold>Send {amount} to:</Bold>
        {recipientName ? (
          <OwnerAddressTableCell address={recipient} knownAddress showLinks userName={recipientName} />
        ) : (
          <EtherscanLink knownAddress={false} type="address" value={recipient} />
        )}
      </Block>
      <Block className={classes.txData} data-testid={TRANSACTIONS_DESC_CUSTOM_DATA_TEST_ID}>
        <Bold>Data (hex encoded):</Bold>
        <Paragraph className={classes.txDataParagraph} noMargin size="md">
          {showTxData ? (
            <>
              {data}{' '}
              <LinkWithRef
                aria-label="Hide details of the transaction"
                className={classes.linkTxData}
                onClick={() => setShowTxData(false)}
                rel="noopener noreferrer"
                target="_blank"
              >
                Show Less
              </LinkWithRef>
            </>
          ) : (
            <>
              {shortVersionOf(data, 20)}{' '}
              <LinkWithRef
                aria-label="Show details of the transaction"
                className={classes.linkTxData}
                onClick={() => setShowTxData(true)}
                rel="noopener noreferrer"
                target="_blank"
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

const TxDescription = ({ classes, tx }: Props) => {
  const {
    addedOwner,
    cancellationTx,
    creationTx,
    customTx,
    data,
    modifySettingsTx,
    newThreshold,
    recipient,
    removedOwner,
    upgradeTx,
  } = getTxData(tx)
  const amount = getTxAmount(tx)
  return (
    <Block className={classes.txDataContainer}>
      {modifySettingsTx && (
        <SettingsDescription addedOwner={addedOwner} newThreshold={newThreshold} removedOwner={removedOwner} />
      )}
      {!upgradeTx && customTx && (
        <CustomDescription amount={amount} classes={classes} data={data} recipient={recipient} />
      )}
      {upgradeTx && <div>{data}</div>}
      {!cancellationTx && !modifySettingsTx && !customTx && !creationTx && !upgradeTx && (
        <TransferDescription amount={amount} recipient={recipient} />
      )}
    </Block>
  )
}

export default withStyles(styles)(TxDescription)
