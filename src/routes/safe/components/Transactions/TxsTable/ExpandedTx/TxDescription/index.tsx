import { withStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { getTxData } from './utils'

import EtherscanLink from 'src/components/EtherscanLink'
import Block from 'src/components/layout/Block'
import Bold from 'src/components/layout/Bold'
import LinkWithRef from 'src/components/layout/Link'
import Paragraph from 'src/components/layout/Paragraph'
import { getNameFromAddressBook } from 'src/logic/addressBook/store/selectors'
import { SAFE_METHODS_NAMES } from 'src/logic/contracts/methodIds'
import { shortVersionOf } from 'src/logic/wallets/ethAddresses'
import OwnerAddressTableCell from 'src/routes/safe/components/Settings/ManageOwners/OwnerAddressTableCell'
import { getTxAmount } from 'src/routes/safe/components/Transactions/TxsTable/columns'

import { lg, md } from 'src/theme/variables'

export const TRANSACTIONS_DESC_ADD_OWNER_TEST_ID = 'tx-description-add-owner'
export const TRANSACTIONS_DESC_REMOVE_OWNER_TEST_ID = 'tx-description-remove-owner'
export const TRANSACTIONS_DESC_CHANGE_THRESHOLD_TEST_ID = 'tx-description-change-threshold'
export const TRANSACTIONS_DESC_SEND_TEST_ID = 'tx-description-send'
export const TRANSACTIONS_DESC_CUSTOM_VALUE_TEST_ID = 'tx-description-custom-value'
export const TRANSACTIONS_DESC_CUSTOM_DATA_TEST_ID = 'tx-description-custom-data'
export const TRANSACTIONS_DESC_NO_DATA = 'tx-description-no-data'

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

const TransferDescription = ({ amount = '', recipient }) => {
  const recipientName = useSelector((state) => getNameFromAddressBook(state, recipient))
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

const RemovedOwner = ({ removedOwner }) => {
  const ownerChangedName = useSelector((state) => getNameFromAddressBook(state, removedOwner))

  return (
    <Block data-testid={TRANSACTIONS_DESC_REMOVE_OWNER_TEST_ID}>
      <Bold>Remove owner:</Bold>
      {ownerChangedName ? (
        <OwnerAddressTableCell address={removedOwner} knownAddress showLinks userName={ownerChangedName} />
      ) : (
        <EtherscanLink knownAddress={false} type="address" value={removedOwner} />
      )}
    </Block>
  )
}

const AddedOwner = ({ addedOwner }) => {
  const ownerChangedName = useSelector((state) => getNameFromAddressBook(state, addedOwner))

  return (
    <Block data-testid={TRANSACTIONS_DESC_ADD_OWNER_TEST_ID}>
      <Bold>Add owner:</Bold>
      {ownerChangedName ? (
        <OwnerAddressTableCell address={addedOwner} knownAddress showLinks userName={ownerChangedName} />
      ) : (
        <EtherscanLink knownAddress={false} type="address" value={addedOwner} />
      )}
    </Block>
  )
}

const NewThreshold = ({ newThreshold }) => (
  <Block data-testid={TRANSACTIONS_DESC_CHANGE_THRESHOLD_TEST_ID}>
    <Bold>Change required confirmations:</Bold>
    <Paragraph noMargin size="md">
      {newThreshold}
    </Paragraph>
  </Block>
)

const SettingsDescription = ({ action, addedOwner, newThreshold, removedOwner }) => {
  if (action === SAFE_METHODS_NAMES.REMOVE_OWNER && removedOwner && newThreshold) {
    return (
      <>
        <RemovedOwner removedOwner={removedOwner} />
        <NewThreshold newThreshold={newThreshold} />
      </>
    )
  }

  if (action === SAFE_METHODS_NAMES.CHANGE_THRESHOLD && newThreshold) {
    return <NewThreshold newThreshold={newThreshold} />
  }

  if (action === SAFE_METHODS_NAMES.ADD_OWNER_WITH_THRESHOLD && addedOwner && newThreshold) {
    return (
      <>
        <AddedOwner addedOwner={addedOwner} />
        <NewThreshold newThreshold={newThreshold} />
      </>
    )
  }

  if (action === SAFE_METHODS_NAMES.SWAP_OWNER && removedOwner && addedOwner) {
    return (
      <>
        <RemovedOwner removedOwner={removedOwner} />
        <AddedOwner addedOwner={addedOwner} />
      </>
    )
  }

  return (
    <Block data-testid={TRANSACTIONS_DESC_NO_DATA}>
      <Bold>No data available for current transaction</Bold>
    </Block>
  )
}

const CustomDescription = ({ amount = 0, classes, data, recipient }: any) => {
  const [showTxData, setShowTxData] = useState(false)
  const recipientName = useSelector((state) => getNameFromAddressBook(state, recipient))
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

const TxDescription = ({ classes, tx }) => {
  const {
    action,
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
  }: any = getTxData(tx)
  const amount = getTxAmount(tx, false)
  return (
    <Block className={classes.txDataContainer}>
      {modifySettingsTx && action && (
        <SettingsDescription
          action={action}
          addedOwner={addedOwner}
          newThreshold={newThreshold}
          removedOwner={removedOwner}
        />
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

export default withStyles(styles as any)(TxDescription)
