import { useSelector } from 'react-redux'
import React from 'react'

import { getNameFromAddressBook } from 'src/logic/addressBook/store/selectors'
import Block from 'src/components/layout/Block'
import Bold from 'src/components/layout/Bold'
import OwnerAddressTableCell from 'src/routes/safe/components/Settings/ManageOwners/OwnerAddressTableCell'
import EtherscanLink from 'src/components/EtherscanLink'
import { SAFE_METHODS_NAMES, SafeMethods } from 'src/logic/contracts/methodIds'
import Paragraph from 'src/components/layout/Paragraph'

export const TRANSACTIONS_DESC_ADD_OWNER_TEST_ID = 'tx-description-add-owner'
export const TRANSACTIONS_DESC_REMOVE_OWNER_TEST_ID = 'tx-description-remove-owner'
export const TRANSACTIONS_DESC_CHANGE_THRESHOLD_TEST_ID = 'tx-description-change-threshold'
export const TRANSACTIONS_DESC_NO_DATA = 'tx-description-no-data'

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

interface SettingsDescriptionProps {
  action: SafeMethods
  addedOwner?: string
  newThreshold?: string
  removedOwner?: string
}

const SettingsDescription = ({
  action,
  addedOwner,
  newThreshold,
  removedOwner,
}: SettingsDescriptionProps): React.ReactElement => {
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

export default SettingsDescription
