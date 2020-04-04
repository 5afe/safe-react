// 
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import { List } from 'immutable'
import React from 'react'

import { styles } from './style'

import Field from 'components/forms/Field'
import GnoForm from 'components/forms/GnoForm'
import SelectField from 'components/forms/SelectField'
import { composeValidators, maxValue, minValue, mustBeInteger, required } from 'components/forms/validator'
import Block from 'components/layout/Block'
import Button from 'components/layout/Button'
import Col from 'components/layout/Col'
import Hairline from 'components/layout/Hairline'
import Paragraph from 'components/layout/Paragraph'
import Row from 'components/layout/Row'

export const ADD_OWNER_THRESHOLD_NEXT_BTN_TEST_ID = 'add-owner-threshold-next-btn'


const ThresholdForm = ({ classes, onClickBack, onClose, onSubmit, owners, threshold }) => {
  const handleSubmit = (values) => {
    onSubmit(values)
  }

  return (
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          Add new owner
        </Paragraph>
        <Paragraph className={classes.annotation}>2 of 3</Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm initialValues={{ threshold: threshold.toString() }} onSubmit={handleSubmit}>
        {() => (
          <>
            <Block className={classes.formContainer}>
              <Row>
                <Paragraph className={classes.headingText} weight="bolder">
                  Set the required owner confirmations:
                </Paragraph>
              </Row>
              <Row>
                <Paragraph weight="bolder">Any transaction requires the confirmation of:</Paragraph>
              </Row>
              <Row align="center" className={classes.inputRow} margin="xl">
                <Col xs={2}>
                  <Field
                    data-testid="threshold-select-input"
                    name="threshold"
                    render={(props) => (
                      <>
                        <SelectField {...props} disableError>
                          {[...Array(Number(owners.size + 1))].map((x, index) => (
                            <MenuItem key={index} value={`${index + 1}`}>
                              {index + 1}
                            </MenuItem>
                          ))}
                        </SelectField>
                        {props.meta.error && props.meta.touched && (
                          <Paragraph className={classes.errorText} color="error" noMargin>
                            {props.meta.error}
                          </Paragraph>
                        )}
                      </>
                    )}
                    validate={composeValidators(required, mustBeInteger, minValue(1), maxValue(owners.size + 1))}
                  />
                </Col>
                <Col xs={10}>
                  <Paragraph className={classes.ownersText} color="primary" noMargin size="lg">
                    out of {owners.size + 1} owner(s)
                  </Paragraph>
                </Col>
              </Row>
            </Block>
            <Hairline />
            <Row align="center" className={classes.buttonRow}>
              <Button minHeight={42} minWidth={140} onClick={onClickBack}>
                Back
              </Button>
              <Button
                color="primary"
                minHeight={42}
                minWidth={140}
                testId={ADD_OWNER_THRESHOLD_NEXT_BTN_TEST_ID}
                type="submit"
                variant="contained"
              >
                Review
              </Button>
            </Row>
          </>
        )}
      </GnoForm>
    </>
  )
}

export default withStyles(styles)(ThresholdForm)
