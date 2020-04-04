// 
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React from 'react'
import { useSelector } from 'react-redux'

import { styles } from './style'

import Modal from 'components/Modal'
import AddressInput from 'components/forms/AddressInput'
import Field from 'components/forms/Field'
import GnoForm from 'components/forms/GnoForm'
import TextField from 'components/forms/TextField'
import { composeValidators, minMaxLength, required, uniqueAddress } from 'components/forms/validator'
import Block from 'components/layout/Block'
import Button from 'components/layout/Button'
import Hairline from 'components/layout/Hairline'
import Paragraph from 'components/layout/Paragraph'
import Row from 'components/layout/Row'
import { getAddressBookListSelector } from 'logic/addressBook/store/selectors'
import { getAddressesListFromAdbk } from 'logic/addressBook/utils'

export const CREATE_ENTRY_INPUT_NAME_ID = 'create-entry-input-name'
export const CREATE_ENTRY_INPUT_ADDRESS_ID = 'create-entry-input-address'
export const SAVE_NEW_ENTRY_BTN_ID = 'save-new-entry-btn-id'


const CreateEditEntryModalComponent = ({
  classes,
  editEntryModalHandler,
  entryToEdit,
  isOpen,
  newEntryModalHandler,
  onClose,
}) => {
  const onFormSubmitted = (values) => {
    if (entryToEdit && !entryToEdit.entry.isNew) {
      editEntryModalHandler(values)
    } else {
      newEntryModalHandler(values)
    }
  }

  const addressBook = useSelector(getAddressBookListSelector)
  const addressBookAddressesList = getAddressesListFromAdbk(addressBook)
  const entryDoesntExist = uniqueAddress(addressBookAddressesList)

  const formMutators = {
    setOwnerAddress: (args, state, utils) => {
      utils.changeValue(state, 'address', () => args[0])
    },
  }

  return (
    <Modal
      description={entryToEdit ? 'Edit addressBook entry' : 'Create new addressBook entry'}
      handleClose={onClose}
      open={isOpen}
      paperClassName={classes.smallerModalWindow}
      title={entryToEdit ? 'Edit entry' : 'Create new entry'}
    >
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          {entryToEdit ? 'Edit entry' : 'Create entry'}
        </Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm formMutators={formMutators} onSubmit={onFormSubmitted}>
        {(...args) => {
          const mutators = args[3]
          return (
            <>
              <Block className={classes.container}>
                <Row margin="md">
                  <Field
                    className={classes.addressInput}
                    component={TextField}
                    defaultValue={entryToEdit ? entryToEdit.entry.name : undefined}
                    name="name"
                    placeholder={entryToEdit ? 'Entry name' : 'New entry'}
                    testId={CREATE_ENTRY_INPUT_NAME_ID}
                    text={entryToEdit ? 'Entry*' : 'New entry*'}
                    type="text"
                    validate={composeValidators(required, minMaxLength(1, 50))}
                  />
                </Row>
                <Row margin="md">
                  <AddressInput
                    className={classes.addressInput}
                    defaultValue={entryToEdit ? entryToEdit.entry.address : undefined}
                    disabled={!!entryToEdit}
                    fieldMutator={mutators.setOwnerAddress}
                    name="address"
                    placeholder="Owner address*"
                    testId={CREATE_ENTRY_INPUT_ADDRESS_ID}
                    text="Owner address*"
                    validators={entryToEdit ? undefined : [entryDoesntExist]}
                  />
                </Row>
              </Block>
              <Hairline />
              <Row align="center" className={classes.buttonRow}>
                <Button minHeight={42} minWidth={140} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  minHeight={42}
                  minWidth={140}
                  testId={SAVE_NEW_ENTRY_BTN_ID}
                  type="submit"
                  variant="contained"
                >
                  {entryToEdit ? 'Save' : 'Create'}
                </Button>
              </Row>
            </>
          )
        }}
      </GnoForm>
    </Modal>
  )
}

export default withStyles(styles)(CreateEditEntryModalComponent)
