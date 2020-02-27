// @flow
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import { withSnackbar } from 'notistack'
import React from 'react'

import { styles } from './style'

import CopyBtn from '~/components/CopyBtn'
import EtherscanBtn from '~/components/EtherscanBtn'
import Identicon from '~/components/Identicon'
import Modal from '~/components/Modal'
import Field from '~/components/forms/Field'
import GnoForm from '~/components/forms/GnoForm'
import TextField from '~/components/forms/TextField'
import { composeValidators, minMaxLength, required } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import Hairline from '~/components/layout/Hairline'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import { getNotificationsFromTxType, showSnackbar } from '~/logic/notifications'
import { TX_NOTIFICATION_TYPES } from '~/logic/safe/transactions'
import { sm } from '~/theme/variables'

export const RENAME_OWNER_INPUT_TEST_ID = 'rename-owner-input'
export const SAVE_OWNER_CHANGES_BTN_TEST_ID = 'save-owner-changes-btn'

type Props = {
  onClose: () => void,
  classes: Object,
  isOpen: boolean,
  safeAddress: string,
  ownerAddress: string,
  selectedOwnerName: string,
  editSafeOwner: Function,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
  updateAddressBookEntry: Function,
}

const EditOwnerComponent = ({
  classes,
  closeSnackbar,
  editSafeOwner,
  enqueueSnackbar,
  isOpen,
  onClose,
  ownerAddress,
  safeAddress,
  selectedOwnerName,
  updateAddressBookEntry,
}: Props) => {
  const handleSubmit = values => {
    const { ownerName } = values
    editSafeOwner({ safeAddress, ownerAddress, ownerName })
    updateAddressBookEntry({ address: ownerAddress, name: ownerName })
    const notification = getNotificationsFromTxType(TX_NOTIFICATION_TYPES.OWNER_NAME_CHANGE_TX)
    showSnackbar(notification.afterExecution.noMoreConfirmationsNeeded, enqueueSnackbar, closeSnackbar)

    onClose()
  }

  return (
    <Modal
      description="Edit owner from Safe"
      handleClose={onClose}
      open={isOpen}
      paperClassName={classes.smallerModalWindow}
      title="Edit owner from Safe"
    >
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          Edit owner name
        </Paragraph>
        <IconButton disableRipple onClick={onClose}>
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
                  className={classes.addressInput}
                  component={TextField}
                  initialValue={selectedOwnerName}
                  name="ownerName"
                  placeholder="Owner name*"
                  testId={RENAME_OWNER_INPUT_TEST_ID}
                  text="Owner name*"
                  type="text"
                  validate={composeValidators(required, minMaxLength(1, 50))}
                />
              </Row>
              <Row>
                <Block className={classes.user} justify="center">
                  <Identicon address={ownerAddress} diameter={32} />
                  <Paragraph color="disabled" noMargin size="md" style={{ marginLeft: sm, marginRight: sm }}>
                    {ownerAddress}
                  </Paragraph>
                  <CopyBtn content={safeAddress} />
                  <EtherscanBtn type="address" value={safeAddress} />
                </Block>
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
                testId={SAVE_OWNER_CHANGES_BTN_TEST_ID}
                type="submit"
                variant="contained"
              >
                Save
              </Button>
            </Row>
          </>
        )}
      </GnoForm>
    </Modal>
  )
}

const EditOwnerModal = withStyles(styles)(withSnackbar(EditOwnerComponent))

export default EditOwnerModal
