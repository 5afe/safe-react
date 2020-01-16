// @flow
import React from 'react'
import { withSnackbar } from 'notistack'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import EtherscanBtn from '~/components/EtherscanBtn'
import CopyBtn from '~/components/CopyBtn'
import Row from '~/components/layout/Row'
import Block from '~/components/layout/Block'
import GnoForm from '~/components/forms/GnoForm'
import Button from '~/components/layout/Button'
import Hairline from '~/components/layout/Hairline'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import Paragraph from '~/components/layout/Paragraph'
import Identicon from '~/components/Identicon'
import { composeValidators, required, minMaxLength } from '~/components/forms/validator'
import { getNotificationsFromTxType, showSnackbar } from '~/logic/notifications'
import { TX_NOTIFICATION_TYPES } from '~/logic/safe/transactions'
import Modal from '~/components/Modal'
import { styles } from './style'
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
  onClose,
  isOpen,
  classes,
  safeAddress,
  ownerAddress,
  selectedOwnerName,
  editSafeOwner,
  enqueueSnackbar,
  closeSnackbar,
  updateAddressBookEntry,
}: Props) => {
  const handleSubmit = (values) => {
    const { ownerName } = values
    editSafeOwner({ safeAddress, ownerAddress, ownerName })
    updateAddressBookEntry({ address: ownerAddress, name: ownerName })
    const notification = getNotificationsFromTxType(TX_NOTIFICATION_TYPES.OWNER_NAME_CHANGE_TX)
    showSnackbar(notification.afterExecution.noMoreConfirmationsNeeded, enqueueSnackbar, closeSnackbar)

    onClose()
  }

  return (
    <Modal
      title="Edit owner from Safe"
      description="Edit owner from Safe"
      handleClose={onClose}
      open={isOpen}
      paperClassName={classes.smallerModalWindow}
    >
      <Row align="center" grow className={classes.heading}>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          Edit owner name
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
                  name="ownerName"
                  component={TextField}
                  type="text"
                  validate={composeValidators(required, minMaxLength(1, 50))}
                  placeholder="Owner name*"
                  text="Owner name*"
                  initialValue={selectedOwnerName}
                  className={classes.addressInput}
                  testId={RENAME_OWNER_INPUT_TEST_ID}
                />
              </Row>
              <Row>
                <Block justify="center" className={classes.user}>
                  <Identicon address={ownerAddress} diameter={32} />
                  <Paragraph style={{ marginLeft: sm, marginRight: sm }} size="md" color="disabled" noMargin>
                    {ownerAddress}
                  </Paragraph>
                  <CopyBtn content={safeAddress} />
                  <EtherscanBtn type="address" value={safeAddress} />
                </Block>
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
                testId={SAVE_OWNER_CHANGES_BTN_TEST_ID}
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
