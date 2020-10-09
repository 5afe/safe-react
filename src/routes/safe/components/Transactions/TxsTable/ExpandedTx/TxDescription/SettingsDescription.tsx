import React from 'react'
import { useSelector } from 'react-redux'
import EtherscanLink from 'src/components/EtherscanLink'
import Block from 'src/components/layout/Block'
import Bold from 'src/components/layout/Bold'
import Paragraph from 'src/components/layout/Paragraph'

import { getNameFromAddressBookSelector } from 'src/logic/addressBook/store/selectors'
import OwnerAddressTableCell from 'src/routes/safe/components/Settings/ManageOwners/OwnerAddressTableCell'
import { SAFE_METHODS_NAMES, SafeMethods } from 'src/routes/safe/store/models/types/transactions.d'

export const TRANSACTIONS_DESC_ADD_OWNER_TEST_ID = 'tx-description-add-owner'
export const TRANSACTIONS_DESC_REMOVE_OWNER_TEST_ID = 'tx-description-remove-owner'
export const TRANSACTIONS_DESC_CHANGE_THRESHOLD_TEST_ID = 'tx-description-change-threshold'
export const TRANSACTIONS_DESC_ADD_MODULE_TEST_ID = 'tx-description-add-module'
export const TRANSACTIONS_DESC_REMOVE_MODULE_TEST_ID = 'tx-description-remove-module'
export const TRANSACTIONS_DESC_NO_DATA = 'tx-description-no-data'

interface RemovedOwnerProps {
  removedOwner: string
}

const RemovedOwner = ({ removedOwner }: RemovedOwnerProps): React.ReactElement => {
  const ownerChangedName = useSelector((state) => getNameFromAddressBookSelector(state, removedOwner))

  return (
    <Block data-testid={TRANSACTIONS_DESC_REMOVE_OWNER_TEST_ID}>
      <Bold>Remove owner:</Bold>
      {ownerChangedName ? (
        <OwnerAddressTableCell address={removedOwner} knownAddress showLinks userName={ownerChangedName} />
      ) : (
        <EtherscanLink knownAddress={false} value={removedOwner} />
      )}
    </Block>
  )
}

interface AddedOwnerProps {
  addedOwner: string
}

const AddedOwner = ({ addedOwner }: AddedOwnerProps): React.ReactElement => {
  const ownerChangedName = useSelector((state) => getNameFromAddressBookSelector(state, addedOwner))

  return (
    <Block data-testid={TRANSACTIONS_DESC_ADD_OWNER_TEST_ID}>
      <Bold>Add owner:</Bold>
      {ownerChangedName ? (
        <OwnerAddressTableCell address={addedOwner} knownAddress showLinks userName={ownerChangedName} />
      ) : (
        <EtherscanLink knownAddress={false} value={addedOwner} />
      )}
    </Block>
  )
}

interface NewThresholdProps {
  newThreshold: string
}

const NewThreshold = ({ newThreshold }: NewThresholdProps): React.ReactElement => (
  <Block data-testid={TRANSACTIONS_DESC_CHANGE_THRESHOLD_TEST_ID}>
    <Bold>Change required confirmations:</Bold>
    <Paragraph noMargin size="md">
      {newThreshold}
    </Paragraph>
  </Block>
)

interface AddModuleProps {
  module: string
}

const AddModule = ({ module }: AddModuleProps): React.ReactElement => (
  <Block data-testid={TRANSACTIONS_DESC_ADD_MODULE_TEST_ID}>
    <Bold>Add module:</Bold>
    <EtherscanLink value={module} knownAddress={false} />
  </Block>
)

interface RemoveModuleProps {
  module: string
}

const RemoveModule = ({ module }: RemoveModuleProps): React.ReactElement => (
  <Block data-testid={TRANSACTIONS_DESC_REMOVE_MODULE_TEST_ID}>
    <Bold>Remove module:</Bold>
    <EtherscanLink value={module} knownAddress={false} />
  </Block>
)

interface SettingsDescriptionProps {
  action: SafeMethods
  addedOwner?: string
  newThreshold?: string
  removedOwner?: string
  module?: string
}

const SettingsDescription = ({
  action,
  addedOwner,
  newThreshold,
  removedOwner,
  module,
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

  if (action === SAFE_METHODS_NAMES.ENABLE_MODULE && module) {
    return <AddModule module={module} />
  }

  if (action === SAFE_METHODS_NAMES.DISABLE_MODULE && module) {
    return <RemoveModule module={module} />
  }

  return (
    <Block data-testid={TRANSACTIONS_DESC_NO_DATA}>
      <Bold>No data available for current transaction</Bold>
    </Block>
  )
}

export default SettingsDescription
