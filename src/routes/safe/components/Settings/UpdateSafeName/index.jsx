// @flow
import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Field from '~/components/forms/Field'
import {
  composeValidators, required, minMaxLength,
} from '~/components/forms/validator'
import TextField from '~/components/forms/TextField'
import GnoForm from '~/components/forms/GnoForm'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph'
import Hairline from '~/components/layout/Hairline'
import Button from '~/components/layout/Button'
import { sm, boldFont } from '~/theme/variables'
import { styles } from './style'

const controlsStyle = {
  backgroundColor: 'white',
  padding: sm,
}

const saveButtonStyle = {
  marginRight: sm,
  fontWeight: boldFont,
}

type Props = {
  classes: Object,
  safeAddress: string,
  safeName: string,
  updateSafe: Funtion
}

const UpdateSafeName = (props: Props) => {
  const {
    classes,
    safeAddress,
    safeName,
    updateSafeName,
  } = props

  const handleSubmit = (values) => {
    updateSafeName(safeAddress, values.safeName)
  }

  return (
    <React.Fragment>
      <GnoForm onSubmit={handleSubmit}>
        {() => (
          <React.Fragment>
            <Block className={classes.formContainer}>
              <Paragraph noMargin className={classes.title} size="lg">
              Modify Safe name
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
                />
              </Block>
            </Block>
            <Hairline />
            <Row style={controlsStyle} align="end" grow>
              <Col end="xs">
                <Button
                  type="submit"
                  style={saveButtonStyle}
                  size="small"
                  variant="contained"
                  color="primary"
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

export default withStyles(styles)(UpdateSafeName)
