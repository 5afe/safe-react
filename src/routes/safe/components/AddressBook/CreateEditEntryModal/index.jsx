// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import { useSelector } from 'react-redux'
import Row from '~/components/layout/Row'
import Block from '~/components/layout/Block'
import GnoForm from '~/components/forms/GnoForm'
import Button from '~/components/layout/Button'
import Hairline from '~/components/layout/Hairline'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import Paragraph from '~/components/layout/Paragraph'
import {
  composeValidators, required, minMaxLength, uniqueAddress,
} from '~/components/forms/validator'
import Modal from '~/components/Modal'
import { styles } from './style'
import AddressInput from '~/components/forms/AddressInput'
import type { AddressBookEntryType } from '~/logic/addressBook/model/addressBook'
import { getAddressBookAddressesListSelector } from '~/logic/addressBook/store/selectors'

export const CREATE_ENTRY_INPUT_NAME_ID = 'create-entry-input-name'
export const CREATE_ENTRY_INPUT_ADDRESS_ID = 'create-entry-input-address'
export const SAVE_NEW_ENTRY_BTN_ID = 'save-new-entry-btn-id'

type Props = {
  onClose: () => void,
  classes: Object,
  isOpen: boolean,
  newEntryModalHandler: Function,
  editEntryModalHandler: Function,
  entryToEdit?: AddressBookEntryType,
}

const CreateEditEntryModalComponent = ({
  onClose,
  isOpen,
  classes,
  newEntryModalHandler,
  entryToEdit,
  editEntryModalHandler,
}: Props) => {
  const onFormSubmitted = (values) => {
    if (entryToEdit) {
      editEntryModalHandler(values)
    } else {
      newEntryModalHandler(values)
    }
  }

  const addressBookAddressesList = useSelector(getAddressBookAddressesListSelector)
  const entryDoesntExist = uniqueAddress(addressBookAddressesList.map((address) => address))
  return (
    <Modal
      title={entryToEdit ? 'Edit entry' : 'Create new entry'}
      description={entryToEdit ? 'Edit addressBook entry' : 'Create new addressBook entry'}
      handleClose={onClose}
      open={isOpen}
      paperClassName={classes.smallerModalWindow}
    >
      <Row align="center" grow className={classes.heading}>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          {entryToEdit ? 'Edit entry' : 'Create entry'}
        </Paragraph>
        <IconButton onClick={onClose} disableRipple>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm onSubmit={onFormSubmitted}>
        {() => (
          <>
            <Block className={classes.container}>
              <Row margin="md">
                <Field
                  name="name"
                  component={TextField}
                  type="text"
                  validate={composeValidators(required, minMaxLength(1, 50))}
                  placeholder={entryToEdit ? 'Entry name' : 'New entry'}
                  text={entryToEdit ? 'Entry*' : 'New entry*'}
                  className={classes.addressInput}
                  testId={CREATE_ENTRY_INPUT_NAME_ID}
                  defaultValue={entryToEdit ? entryToEdit.entry.name : undefined}
                />
              </Row>
              <Row margin="md">
                <AddressInput
                  name="address"
                  validators={entryToEdit ? undefined : [entryDoesntExist]}
                  placeholder="Owner address*"
                  text="Owner address*"
                  className={classes.addressInput}
                  testId={CREATE_ENTRY_INPUT_ADDRESS_ID}
                  defaultValue={entryToEdit ? entryToEdit.entry.address : undefined}
                />
              </Row>
            </Block>
            <Hairline />
            <Row align="center" className={classes.buttonRow}>
              <Button minWidth={140} minHeight={42} onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                minWidth={140}
                minHeight={42}
                color="primary"
                testId={SAVE_NEW_ENTRY_BTN_ID}
              >
                {entryToEdit ? 'Save' : 'Create'}
              </Button>
            </Row>
          </>
        )}
      </GnoForm>
    </Modal>
  )
}

const CreateEditEntryModal = withStyles(styles)(CreateEditEntryModalComponent)

export default CreateEditEntryModal
