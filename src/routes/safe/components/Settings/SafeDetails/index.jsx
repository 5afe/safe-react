// @flow
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { withSnackbar } from 'notistack'
import { useSelector } from 'react-redux'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Field from '~/components/forms/Field'
import Heading from '~/components/layout/Heading'
import { composeValidators, required, minMaxLength } from '~/components/forms/validator'
import TextField from '~/components/forms/TextField'
import GnoForm from '~/components/forms/GnoForm'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph'
import Button from '~/components/layout/Button'
import { getNotificationsFromTxType, showSnackbar } from '~/logic/notifications'
import { TX_NOTIFICATION_TYPES } from '~/logic/safe/transactions'
import { styles } from './style'
import { getSafeVersion } from '~/logic/safe/utils/safeVersion'
import UpdateSafeModal from '~/routes/safe/components/Settings/UpdateSafeModal'
import Modal from '~/components/Modal'
import { grantedSelector } from '~/routes/safe/container/selector'

export const SAFE_NAME_INPUT_TEST_ID = 'safe-name-input'
export const SAFE_NAME_SUBMIT_BTN_TEST_ID = 'change-safe-name-btn'
export const SAFE_NAME_UPDATE_SAFE_BTN_TEST_ID = 'update-safe-name-btn'

type Props = {
  safeAddress: string,
  safeName: string,
  updateSafe: Function,
  enqueueSnackbar: Function,
  createTransaction: Function,
  closeSnackbar: Function,
}

const useStyles = makeStyles(styles)

const SafeDetails = (props: Props) => {
  const classes = useStyles()
  const [safeVersions, setSafeVersions] = React.useState({ current: null, latest: null, needUpdate: false })
  const isUserOwner = useSelector(grantedSelector)
  const {
    safeAddress, safeName, updateSafe, enqueueSnackbar, closeSnackbar, createTransaction,
  } = props

  const [isModalOpen, setModalOpen] = useState(false)

  const toggleModal = () => {
    setModalOpen((prevOpen) => !prevOpen)
  }

  const handleSubmit = (values) => {
    updateSafe({ address: safeAddress, name: values.safeName })

    const notification = getNotificationsFromTxType(TX_NOTIFICATION_TYPES.SAFE_NAME_CHANGE_TX)
    showSnackbar(notification.afterExecution.noMoreConfirmationsNeeded, enqueueSnackbar, closeSnackbar)
  }

  const handleUpdateSafe = () => {
    setModalOpen(true)
  }

  useEffect(() => {
    const getVersion = async () => {
      try {
        const { current, latest, needUpdate } = await getSafeVersion(safeAddress)
        setSafeVersions({ current, latest, needUpdate })
      } catch (err) {
        setSafeVersions({ current: 'Version not defined' })
        console.error(err)
      }
    }
    getVersion()
  }, [])

  return (
    <>
      <GnoForm onSubmit={handleSubmit}>
        {() => (
          <>
            <Block className={classes.formContainer}>
              <Heading tag="h2">Safe Version</Heading>
              <Row align="end" grow>
                <Paragraph className={classes.versionNumber}>
                  {safeVersions.current}
                  {safeVersions.needUpdate && ` (there's a newer version: ${safeVersions.latest})`}
                </Paragraph>
              </Row>
              {safeVersions.needUpdate && isUserOwner ? (
                <Row align="end" grow>
                  <Paragraph>
                    <Button
                      onClick={handleUpdateSafe}
                      className={classes.saveBtn}
                      size="small"
                      variant="contained"
                      color="primary"
                      testId={SAFE_NAME_UPDATE_SAFE_BTN_TEST_ID}
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
                  name="safeName"
                  component={TextField}
                  type="text"
                  validate={composeValidators(required, minMaxLength(1, 50))}
                  placeholder="Safe name*"
                  text="Safe name*"
                  defaultValue={safeName}
                  testId={SAFE_NAME_INPUT_TEST_ID}
                />
              </Block>
            </Block>
            <Row className={classes.controlsRow} align="end" grow>
              <Col end="xs">
                <Button
                  type="submit"
                  className={classes.saveBtn}
                  size="small"
                  variant="contained"
                  color="primary"
                  testId={SAFE_NAME_SUBMIT_BTN_TEST_ID}
                >
                  Save
                </Button>
              </Col>
            </Row>
            <Modal
              title="Update Safe"
              description="Update Safe"
              handleClose={toggleModal}
              open={isModalOpen}
            >
              <UpdateSafeModal onClose={toggleModal} safeAddress={safeAddress} createTransaction={createTransaction} />
            </Modal>
          </>
        )}
      </GnoForm>
    </>
  )
}

export default withSnackbar(SafeDetails)
