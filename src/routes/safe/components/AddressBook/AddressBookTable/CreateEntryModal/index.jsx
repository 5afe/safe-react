// @flow
import React from 'react'
import { withSnackbar } from 'notistack'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import { List } from 'immutable'
import { useDispatch } from 'react-redux'
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
import { getNotificationsFromTxType, showSnackbar } from '~/logic/notifications'
import { TX_NOTIFICATION_TYPES } from '~/logic/safe/transactions'
import Modal from '~/components/Modal'
import { styles } from './style'
import AddressInput from '~/components/forms/AddressInput'
import { addAddressBookEntry } from '~/logic/addressBook/store/actions/addAddressBookEntry'

export const CREATE_ENTRY_INPUT_NAME_ID = 'create-entry-input-name'
export const CREATE_ENTRY_INPUT_ADDRESS_ID = 'create-entry-input-address'
export const SAVE_NEW_ENTRY_BTN_ID = 'save-new-entry-btn-id'

type Props = {
  onClose: () => void,
  classes: Object,
  isOpen: boolean,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
}

const CreateEntryModalComponent = ({
  onClose,
  isOpen,
  classes,
  enqueueSnackbar,
  closeSnackbar,
}: Props) => {
  const dispatch = useDispatch()

  const handleSubmit = (values) => {
    const { name, ownerAddress } = values
    const notification = getNotificationsFromTxType(TX_NOTIFICATION_TYPES.ADDRESSBOOK_NEW_ENTRY)
    showSnackbar(notification.afterExecution.noMoreConfirmationsNeeded, enqueueSnackbar, closeSnackbar)
    dispatch(addAddressBookEntry({ name, ownerAddress }))
    onClose()
  }

  const entries = List()
  const entryDoesntExist = uniqueAddress(entries.map((o) => o.address))
  return (
    <Modal
      title="Create new entry"
      description="Create new addressBook entry"
      handleClose={onClose}
      open={isOpen}
      paperClassName={classes.smallerModalWindow}
    >
      <Row align="center" grow className={classes.heading}>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          Create entry
        </Paragraph>
        <IconButton onClick={onClose} disableRipple>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm onSubmit={handleSubmit}>
        {() => (
          <>
            <Block className={classes.container}>
              <Row margin="md">
                <Field
                  name="name"
                  component={TextField}
                  type="text"
                  validate={composeValidators(required, minMaxLength(1, 50))}
                  placeholder="New entry"
                  text="New entry*"
                  className={classes.addressInput}
                  testId={CREATE_ENTRY_INPUT_NAME_ID}
                />
              </Row>
              <Row margin="md">
                <AddressInput
                  name="ownerAddress"
                  validators={[entryDoesntExist]}
                  placeholder="Owner address*"
                  text="Owner address*"
                  className={classes.addressInput}
                  testId={CREATE_ENTRY_INPUT_ADDRESS_ID}
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
                Create
              </Button>
            </Row>
          </>
        )}
      </GnoForm>
    </Modal>
  )
}

const CreateEntryModal = withStyles(styles)(withSnackbar(CreateEntryModalComponent))

export default CreateEntryModal
