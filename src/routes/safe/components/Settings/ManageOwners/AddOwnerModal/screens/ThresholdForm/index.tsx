import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'
import { ReactElement } from 'react'
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
import { currentSafe } from 'src/logic/safe/store/selectors'
import { Modal } from 'src/components/Modal'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { getStepTitle } from 'src/routes/safe/components/Balances/SendModal/utils'

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
  const { owners, threshold = 1 } = useSelector(currentSafe) ?? {}
  const numOptions = owners ? owners.length + 1 : 0

  const handleSubmit = (values: SubmitProps) => {
    onSubmit(values)
  }

  return (
    <>
      <ModalHeader onClose={onClose} title="Add new owner" subTitle={getStepTitle(2, 3)} />
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
                          {[...Array(Number(numOptions))].map((x, index) => (
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
                    validate={composeValidators(required, mustBeInteger, minValue(1), maxValue(numOptions))}
                  />
                </Col>
                <Col xs={10}>
                  <Paragraph className={classes.ownersText} color="primary" noMargin size="lg">
                    out of {numOptions} owner(s)
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
