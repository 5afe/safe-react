// @flow
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { withSnackbar } from 'notistack'
import semverLessThan from 'semver/functions/lt'
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
import { getSafeMasterContract } from '~/logic/contracts/safeContracts'

export const SAFE_NAME_INPUT_TEST_ID = 'safe-name-input'
export const SAFE_NAME_SUBMIT_BTN_TEST_ID = 'change-safe-name-btn'

type Props = {
  safeAddress: string,
  safeName: string,
  updateSafe: Function,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
}

const useStyles = makeStyles(styles)

const SafeDetails = (props: Props) => {
  const classes = useStyles()
  const [safeVersions, setSafeVersions] = React.useState({ current: '0.0.0', latest: '0.0.0', needUpdate: false })
  const {
    safeAddress, safeName, updateSafe, enqueueSnackbar, closeSnackbar,
  } = props

  const handleSubmit = (values) => {
    updateSafe({ address: safeAddress, name: values.safeName })

    const notification = getNotificationsFromTxType(TX_NOTIFICATION_TYPES.SAFE_NAME_CHANGE_TX)
    showSnackbar(notification.afterExecution.noMoreConfirmationsNeeded, enqueueSnackbar, closeSnackbar)
  }

  React.useEffect(() => {
    const getVersion = async () => {
      const safeMaster = await getSafeMasterContract()
      const current = await safeMaster.VERSION()
      const latest = process.env.REACT_APP_LATEST_SAFE_VERSION
      const needUpdate = semverLessThan(current, latest)

      setSafeVersions({ current, latest, needUpdate })
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
                <Block className={classes.root}>
                  {safeVersions.current}
                  {safeVersions.needUpdate && ` (there's a newer version: ${safeVersions.latest})`}
                </Block>
              </Row>
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
          </>
        )}
      </GnoForm>
    </>
  )
}

export default withSnackbar(SafeDetails)
