import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'

import { useStyles } from './style'

import Modal, { Modal as GenericModal } from 'src/components/Modal'
import { ScanQRWrapper } from 'src/components/ScanQRModal/ScanQRWrapper'
import AddressInput from 'src/components/forms/AddressInput'
import Field from 'src/components/forms/Field'
import GnoForm from 'src/components/forms/GnoForm'
import TextField from 'src/components/forms/TextField'
import { composeValidators, minMaxLength, required, uniqueAddress } from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { addressBookAddressesListSelector } from 'src/logic/addressBook/store/selectors'
import { AddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { Entry } from 'src/routes/safe/components/AddressBook'

export const CREATE_ENTRY_INPUT_NAME_ID = 'create-entry-input-name'
export const CREATE_ENTRY_INPUT_ADDRESS_ID = 'create-entry-input-address'
export const SAVE_NEW_ENTRY_BTN_ID = 'save-new-entry-btn-id'

const formMutators = {
  setOwnerAddress: (args, state, utils) => {
    utils.changeValue(state, 'address', () => args[0])
  },
}

type CreateEditEntryModalProps = {
  editEntryModalHandler: (entry: AddressBookEntry) => void
  entryToEdit: Entry
  isOpen: boolean
  newEntryModalHandler: (entry: AddressBookEntry) => void
  onClose: () => void
}

export const CreateEditEntryModal = ({
  editEntryModalHandler,
  entryToEdit,
  isOpen,
  newEntryModalHandler,
  onClose,
}: CreateEditEntryModalProps): ReactElement => {
  const classes = useStyles()

  const { isNew, ...initialValues } = entryToEdit.entry

  const onFormSubmitted = (values: AddressBookEntry) => {
    if (isNew) {
      newEntryModalHandler(values)
    } else {
      editEntryModalHandler(values)
    }
  }

  const storedAddresses = useSelector(addressBookAddressesListSelector)
  const isUniqueAddress = uniqueAddress(storedAddresses)

  return (
    <Modal
      description={isNew ? 'Create new addressBook entry' : 'Edit addressBook entry'}
      handleClose={onClose}
      open={isOpen}
      paperClassName="smaller-modal-window"
      title={isNew ? 'Create new entry' : 'Edit entry'}
    >
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          {isNew ? 'Create entry' : 'Edit entry'}
        </Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm formMutators={formMutators} onSubmit={onFormSubmitted} initialValues={initialValues}>
        {(...args) => {
          const formState = args[2]
          const mutators = args[3]
          const handleScan = (value, closeQrModal) => {
            let scannedAddress = value

            if (scannedAddress.startsWith('ethereum:')) {
              scannedAddress = scannedAddress.replace('ethereum:', '')
            }

            mutators.setOwnerAddress(scannedAddress)
            closeQrModal()
          }
          return (
            <>
              <Block className={classes.container}>
                <Row margin="md">
                  <Col xs={11}>
                    <Field
                      component={TextField}
                      name="name"
                      placeholder="Name"
                      testId={CREATE_ENTRY_INPUT_NAME_ID}
                      text="Name"
                      type="text"
                      validate={composeValidators(required, minMaxLength(1, 50))}
                    />
                  </Col>
                </Row>
                <Row margin="md">
                  <Col xs={11}>
                    <AddressInput
                      disabled={!isNew}
                      fieldMutator={mutators.setOwnerAddress}
                      name="address"
                      placeholder="Address*"
                      testId={CREATE_ENTRY_INPUT_ADDRESS_ID}
                      text="Address*"
                      validators={[(value?: string) => (isNew ? isUniqueAddress(value) : undefined)]}
                    />
                  </Col>
                  {isNew ? (
                    <Col center="xs" className={classes} middle="xs" xs={1}>
                      <ScanQRWrapper handleScan={handleScan} />
                    </Col>
                  ) : null}
                </Row>
              </Block>
              <GenericModal.Footer>
                <GenericModal.Footer.Buttons
                  cancelButtonProps={{ onClick: onClose }}
                  confirmButtonProps={{
                    disabled: !formState.valid,
                    testId: SAVE_NEW_ENTRY_BTN_ID,
                    text: isNew ? 'Create' : 'Save',
                  }}
                />
              </GenericModal.Footer>
            </>
          )
        }}
      </GnoForm>
    </Modal>
  )
}
