// @flow
import { makeStyles } from '@material-ui/core/styles'
import { withSnackbar } from 'notistack'
import React from 'react'
import { useSelector } from 'react-redux'

import { styles } from './style'

import Modal from '~/components/Modal'
import Field from '~/components/forms/Field'
import GnoForm from '~/components/forms/GnoForm'
import TextField from '~/components/forms/TextField'
import { composeValidators, minMaxLength, required } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import Col from '~/components/layout/Col'
import Heading from '~/components/layout/Heading'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import { getNotificationsFromTxType, showSnackbar } from '~/logic/notifications'
import { TX_NOTIFICATION_TYPES } from '~/logic/safe/transactions'
import UpdateSafeModal from '~/routes/safe/components/Settings/UpdateSafeModal'
import { grantedSelector } from '~/routes/safe/container/selector'
import { latestMasterContractVersionSelector } from '~/routes/safe/store/selectors'

export const SAFE_NAME_INPUT_TEST_ID = 'safe-name-input'
export const SAFE_NAME_SUBMIT_BTN_TEST_ID = 'change-safe-name-btn'
export const SAFE_NAME_UPDATE_SAFE_BTN_TEST_ID = 'update-safe-name-btn'

type Props = {
  safeAddress: string,
  safeCurrentVersion: string,
  safeName: string,
  safeNeedsUpdate: boolean,
  updateSafe: Function,
  enqueueSnackbar: Function,
  createTransaction: Function,
  closeSnackbar: Function,
}

const useStyles = makeStyles(styles)

const SafeDetails = (props: Props) => {
  const classes = useStyles()
  const isUserOwner = useSelector(grantedSelector)
  const latestMasterContractVersion = useSelector(latestMasterContractVersionSelector)
  const {
    closeSnackbar,
    enqueueSnackbar,
    safeAddress,
    safeCurrentVersion,
    safeName,
    safeNeedsUpdate,
    updateSafe,
  } = props

  const [isModalOpen, setModalOpen] = React.useState(false)

  const toggleModal = () => {
    setModalOpen(prevOpen => !prevOpen)
  }

  const handleSubmit = values => {
    updateSafe({ address: safeAddress, name: values.safeName })

    const notification = getNotificationsFromTxType(TX_NOTIFICATION_TYPES.SAFE_NAME_CHANGE_TX)
    showSnackbar(notification.afterExecution.noMoreConfirmationsNeeded, enqueueSnackbar, closeSnackbar)
  }

  const handleUpdateSafe = () => {
    setModalOpen(true)
  }

  return (
    <>
      <GnoForm onSubmit={handleSubmit}>
        {() => (
          <>
            <Block className={classes.formContainer}>
              <Heading tag="h2">Safe Version</Heading>
              <Row align="end" grow>
                <Paragraph className={classes.versionNumber}>
                  {safeCurrentVersion}
                  {safeNeedsUpdate && ` (there's a newer version: ${latestMasterContractVersion})`}
                </Paragraph>
              </Row>
              {safeNeedsUpdate && isUserOwner ? (
                <Row align="end" grow>
                  <Paragraph>
                    <Button
                      className={classes.saveBtn}
                      color="primary"
                      onClick={handleUpdateSafe}
                      size="small"
                      testId={SAFE_NAME_UPDATE_SAFE_BTN_TEST_ID}
                      variant="contained"
                    >
                      Update Safe
                    </Button>
                  </Paragraph>
                </Row>
              ) : null}
            </Block>
            <Block className={classes.formContainer}>
              <Heading tag="h2">Modify Safe name</Heading>
              <Paragraph>
                You can change the name of this Safe. This name is only stored locally and never shared with Gnosis or
                any third parties.
              </Paragraph>
              <Block className={classes.root}>
                <Field
                  component={TextField}
                  defaultValue={safeName}
                  name="safeName"
                  placeholder="Safe name*"
                  testId={SAFE_NAME_INPUT_TEST_ID}
                  text="Safe name*"
                  type="text"
                  validate={composeValidators(required, minMaxLength(1, 50))}
                />
              </Block>
            </Block>
            <Row align="end" className={classes.controlsRow} grow>
              <Col end="xs">
                <Button
                  className={classes.saveBtn}
                  color="primary"
                  size="small"
                  testId={SAFE_NAME_SUBMIT_BTN_TEST_ID}
                  type="submit"
                  variant="contained"
                >
                  Save
                </Button>
              </Col>
            </Row>
            <Modal description="Update Safe" handleClose={toggleModal} open={isModalOpen} title="Update Safe">
              <UpdateSafeModal onClose={toggleModal} safeAddress={safeAddress} />
            </Modal>
          </>
        )}
      </GnoForm>
    </>
  )
}

export default withSnackbar(SafeDetails)
