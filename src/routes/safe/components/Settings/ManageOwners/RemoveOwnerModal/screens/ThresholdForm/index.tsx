import MenuItem from '@material-ui/core/MenuItem'
import { ReactElement } from 'react'
import { useSelector } from 'react-redux'

import { useStyles } from './style'

import Field from 'src/components/forms/Field'
import GnoForm from 'src/components/forms/GnoForm'
import SelectField from 'src/components/forms/SelectField'
import { composeValidators, maxValue, minValue, mustBeInteger, required } from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { Modal } from 'src/components/Modal'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { getStepTitle } from 'src/routes/safe/components/Balances/SendModal/utils'

export const REMOVE_OWNER_THRESHOLD_NEXT_BTN_TEST_ID = 'remove-owner-threshold-next-btn'

type ThresholdValues = {
  threshold: string
}

type Props = {
  onClickBack: () => void
  onClose: () => void
  onSubmit: (txParameters: TxParameters) => void
  initialValues: ThresholdValues
}

export const ThresholdForm = ({ onClickBack, onClose, onSubmit, initialValues }: Props): ReactElement => {
  const classes = useStyles()
  const { owners, threshold = 1 } = useSelector(currentSafe) ?? {}
  const ownersCount = owners?.length ?? 0
  const handleSubmit = (values) => {
    onSubmit(values)
  }
  const defaultThreshold = threshold > 1 && threshold === ownersCount ? threshold - 1 : threshold

  return (
    <>
      <ModalHeader onClose={onClose} subTitle={getStepTitle(2, 3)} title="Remove owner" />
      <Hairline />
      <GnoForm
        initialValues={{ threshold: initialValues.threshold || defaultThreshold.toString() }}
        onSubmit={handleSubmit}
      >
        {() => {
          const numOptions = ownersCount > 1 ? ownersCount - 1 : 1

          return (
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
                      out of {ownersCount ? ownersCount - 1 : 0} owner(s)
                    </Paragraph>
                  </Col>
                </Row>
              </Block>
              <Modal.Footer>
                <Modal.Footer.Buttons
                  cancelButtonProps={{ onClick: onClickBack, text: 'Back' }}
                  confirmButtonProps={{ testId: REMOVE_OWNER_THRESHOLD_NEXT_BTN_TEST_ID, text: 'Review' }}
                />
              </Modal.Footer>
            </>
          )
        }}
      </GnoForm>
    </>
  )
}
