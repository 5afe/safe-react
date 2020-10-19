import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import CopyBtn from 'src/components/CopyBtn'
import EtherscanBtn from 'src/components/EtherscanBtn'
import Field from 'src/components/forms/Field'
import GnoForm from 'src/components/forms/GnoForm'
import TextField from 'src/components/forms/TextField'
import { composeValidators, minMaxLength, required } from 'src/components/forms/validator'
import Identicon from 'src/components/Identicon'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import Modal from 'src/components/Modal'
import { makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { addOrUpdateAddressBookEntry } from 'src/logic/addressBook/store/actions/addOrUpdateAddressBookEntry'
import { NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import editSafeOwner from 'src/logic/safe/store/actions/editSafeOwner'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { sm } from 'src/theme/variables'

import { styles } from './style'

export const RENAME_OWNER_INPUT_TEST_ID = 'rename-owner-input'
export const SAVE_OWNER_CHANGES_BTN_TEST_ID = 'save-owner-changes-btn'

const useStyles = makeStyles(styles)

type OwnProps = {
  isOpen: boolean
  onClose: () => void
  ownerAddress: string
  selectedOwnerName: string
}

const EditOwnerComponent = ({ isOpen, onClose, ownerAddress, selectedOwnerName }: OwnProps): React.ReactElement => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const safeAddress = useSelector(safeParamAddressFromStateSelector) as string
  const handleSubmit = (values) => {
    const { ownerName } = values

    dispatch(editSafeOwner({ safeAddress, ownerAddress, ownerName }))
    dispatch(addOrUpdateAddressBookEntry(makeAddressBookEntry({ address: ownerAddress, name: ownerName })))
    dispatch(enqueueSnackbar(NOTIFICATIONS.OWNER_NAME_CHANGE_EXECUTED_MSG))

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
                <Block justify="center">
                  <Identicon address={ownerAddress} diameter={32} />
                  <Paragraph color="disabled" noMargin size="md" style={{ marginLeft: sm, marginRight: sm }}>
                    {ownerAddress}
                  </Paragraph>
                  <CopyBtn content={safeAddress} />
                  <EtherscanBtn value={safeAddress} />
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

export default EditOwnerComponent
