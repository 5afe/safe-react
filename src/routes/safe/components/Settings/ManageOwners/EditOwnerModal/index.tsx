import { useDispatch, useSelector } from 'react-redux'

import { getExplorerInfo } from 'src/config'
import Field from 'src/components/forms/Field'
import GnoForm from 'src/components/forms/GnoForm'
import TextField from 'src/components/forms/TextField'
import { composeValidators, required, validAddressBookName } from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import Hairline from 'src/components/layout/Hairline'
import Row from 'src/components/layout/Row'
import Modal, { Modal as GenericModal } from 'src/components/Modal'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { addressBookAddOrUpdate } from 'src/logic/addressBook/store/actions'
import { NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { OwnerData } from 'src/routes/safe/components/Settings/ManageOwners/dataFetcher'

import { useStyles } from './style'
import { currentChainId } from 'src/logic/config/store/selectors'

export const RENAME_OWNER_INPUT_TEST_ID = 'rename-owner-input'
export const SAVE_OWNER_CHANGES_BTN_TEST_ID = 'save-owner-changes-btn'

type OwnProps = {
  isOpen: boolean
  onClose: () => void
  owner: OwnerData
}

export const EditOwnerModal = ({ isOpen, onClose, owner }: OwnProps): React.ReactElement => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const chainId = useSelector(currentChainId)

  const handleSubmit = ({ ownerName }: { ownerName: string }): void => {
    // Update the value only if the ownerName really changed
    if (ownerName !== owner.name) {
      dispatch(addressBookAddOrUpdate(makeAddressBookEntry({ address: owner.address, name: ownerName, chainId })))
      dispatch(enqueueSnackbar(NOTIFICATIONS.OWNER_NAME_CHANGE_EXECUTED_MSG))
    }
    onClose()
  }

  return (
    <Modal
      description="Edit owner from Safe"
      handleClose={onClose}
      open={isOpen}
      paperClassName="smaller-modal-window"
      title="Edit owner from Safe"
    >
      <ModalHeader onClose={onClose} title="Edit owner name" />
      <Hairline />
      <GnoForm onSubmit={handleSubmit} subscription={{ pristine: true }}>
        {(...args) => {
          const pristine = args[2].pristine
          return (
            <>
              <Block className={classes.container}>
                <Row margin="md">
                  <Field
                    component={TextField}
                    initialValue={owner.name}
                    name="ownerName"
                    placeholder="Owner name*"
                    testId={RENAME_OWNER_INPUT_TEST_ID}
                    label="Owner name*"
                    type="text"
                    validate={composeValidators(required, validAddressBookName)}
                  />
                </Row>
                <Row>
                  <Block justify="center">
                    <PrefixedEthHashInfo
                      hash={owner.address}
                      showCopyBtn
                      showAvatar
                      explorerUrl={getExplorerInfo(owner.address)}
                    />
                  </Block>
                </Row>
              </Block>
              <GenericModal.Footer>
                <GenericModal.Footer.Buttons
                  cancelButtonProps={{ onClick: onClose }}
                  confirmButtonProps={{ disabled: pristine, testId: SAVE_OWNER_CHANGES_BTN_TEST_ID, text: 'Save' }}
                />
              </GenericModal.Footer>
            </>
          )
        }}
      </GnoForm>
    </Modal>
  )
}
