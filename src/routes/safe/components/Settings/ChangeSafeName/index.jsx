// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Field from '~/components/forms/Field'
import Heading from '~/components/layout/Heading'
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

export const SAFE_NAME_INPUT_TESTID = 'safe-name-input'
export const SAFE_NAME_SUBMIT_BTN_TESTID = 'change-safe-name-btn'

type Props = {
  classes: Object,
  safeAddress: string,
  safeName: string,
  updateSafe: Function,
}

const ChangeSafeName = (props: Props) => {
  const {
    classes, safeAddress, safeName, updateSafe,
  } = props

  const handleSubmit = (values) => {
    updateSafe({ address: safeAddress, name: values.safeName })
  }

  return (
    <React.Fragment>
      <GnoForm onSubmit={handleSubmit}>
        {() => (
          <React.Fragment>
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
                  testId={SAFE_NAME_INPUT_TESTID}
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
                  testId={SAFE_NAME_SUBMIT_BTN_TESTID}
                >
                  SAVE
                </Button>
              </Col>
            </Row>
          </React.Fragment>
        )}
      </GnoForm>
    </React.Fragment>
  )
}

export default withStyles(styles)(ChangeSafeName)
