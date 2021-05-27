import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'

import { styles } from './style'

import Field from 'src/components/forms/Field'
import GnoForm from 'src/components/forms/GnoForm'
import SelectField from 'src/components/forms/SelectField'
import { composeValidators, maxValue, minValue, mustBeInteger, required } from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { safeOwnersSelector, safeThresholdSelector } from 'src/logic/safe/store/selectors'
import { Modal } from 'src/components/Modal'

export const ADD_OWNER_THRESHOLD_NEXT_BTN_TEST_ID = 'add-owner-threshold-next-btn'

const useStyles = makeStyles(styles)

type SubmitProps = {
  threshold: number
}

type ThresholdValues = {
  threshold: string
}

type Props = {
  onClickBack: () => void
  onClose: () => void
  onSubmit: (values: SubmitProps) => void
  initialValues: ThresholdValues
}

export const ThresholdForm = ({ onClickBack, onClose, onSubmit, initialValues }: Props): ReactElement => {
  const classes = useStyles()
  const threshold = useSelector(safeThresholdSelector) as number
  const owners = useSelector(safeOwnersSelector)

  const handleSubmit = (values: SubmitProps) => {
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
      <GnoForm initialValues={{ threshold: initialValues.threshold || threshold.toString() }} onSubmit={handleSubmit}>
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
                          {[...Array(Number(owners ? owners.size + 1 : 0))].map((x, index) => (
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
                    validate={composeValidators(
                      required,
                      mustBeInteger,
                      minValue(1),
                      maxValue(owners ? owners.size + 1 : 0),
                    )}
                  />
                </Col>
                <Col xs={10}>
                  <Paragraph className={classes.ownersText} color="primary" noMargin size="lg">
                    out of {owners ? owners.size + 1 : 0} owner(s)
                  </Paragraph>
                </Col>
              </Row>
            </Block>
            <Hairline />
            <Row align="center" className={classes.buttonRow}>
              <Modal.Footer.Buttons
                cancelButtonProps={{ onClick: onClickBack, text: 'Back' }}
                confirmButtonProps={{
                  type: 'submit',
                  text: 'Review',
                  testId: ADD_OWNER_THRESHOLD_NEXT_BTN_TEST_ID,
                }}
              />
            </Row>
          </>
        )}
      </GnoForm>
    </>
  )
}
