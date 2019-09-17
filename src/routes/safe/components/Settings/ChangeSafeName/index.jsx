// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { withSnackbar } from 'notistack'
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
import { type Variant } from '~/components/Header'
import { styles } from './style'

export const SAFE_NAME_INPUT_TEST_ID = 'safe-name-input'
export const SAFE_NAME_SUBMIT_BTN_TEST_ID = 'change-safe-name-btn'

type Props = {
  classes: Object,
  safeAddress: string,
  safeName: string,
  updateSafe: Function,
  enqueueSnackbar: (message: string, variant: Variant) => void,
}

const ChangeSafeName = (props: Props) => {
  const {
    classes, safeAddress, safeName, updateSafe, enqueueSnackbar,
  } = props

  const handleSubmit = (values) => {
    updateSafe({ address: safeAddress, name: values.safeName })
    enqueueSnackbar('Safe name changed', 'success')
  }

  return (
    <>
      <GnoForm onSubmit={handleSubmit}>
        {() => (
          <>
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

export default withStyles(styles)(withSnackbar(ChangeSafeName))
