// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Field from '~/components/forms/Field'
import Heading from '~/components/layout/Heading'
import { SharedSnackbarConsumer } from '~/components/SharedSnackBar'
import { composeValidators, required, minMaxLength } from '~/components/forms/validator'
import TextField from '~/components/forms/TextField'
import GnoForm from '~/components/forms/GnoForm'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph'
import Hairline from '~/components/layout/Hairline'
import Button from '~/components/layout/Button'
import { sm } from '~/theme/variables'
import { styles } from './style'

const controlsStyle = {
  backgroundColor: 'white',
  padding: sm,
}

export const SAFE_NAME_INPUT_TEST_ID = 'safe-name-input'
export const SAFE_NAME_SUBMIT_BTN_TEST_ID = 'change-safe-name-btn'

type Props = {
  classes: Object,
  safeAddress: string,
  safeName: string,
  updateSafe: Function,
  openSnackbar: Function,
}

const ChangeSafeName = (props: Props) => {
  const {
    classes, safeAddress, safeName, updateSafe, openSnackbar,
  } = props

  const handleSubmit = (values) => {
    updateSafe({ address: safeAddress, name: values.safeName })
    openSnackbar('Safe name changed', 'success')
  }

  return (
    <>
      <GnoForm onSubmit={handleSubmit}>
        {() => (
          <>
            <Block className={classes.formContainer}>
              <Heading tag="h3">Modify Safe name</Heading>
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
            <Hairline />
            <Row style={controlsStyle} align="end" grow>
              <Col end="xs">
                <Button
                  type="submit"
                  className={classes.saveBtn}
                  size="small"
                  variant="contained"
                  color="primary"
                  testId={SAFE_NAME_SUBMIT_BTN_TEST_ID}
                >
                  SAVE
                </Button>
              </Col>
            </Row>
          </>
        )}
      </GnoForm>
    </>
  )
}

const withSnackbar = (props) => (
  <SharedSnackbarConsumer>
    {({ openSnackbar }) => <ChangeSafeName {...props} openSnackbar={openSnackbar} />}
  </SharedSnackbarConsumer>
)

export default withStyles(styles)(withSnackbar)
