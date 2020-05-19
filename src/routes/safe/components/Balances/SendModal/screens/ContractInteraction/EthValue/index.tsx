//
import InputAdornment from '@material-ui/core/InputAdornment'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useField } from 'react-final-form'
import { useSelector } from 'react-redux'

import Field from 'components/forms/Field'
import TextField from 'components/forms/TextField'
import { composeValidators, maxValue, mustBeFloat } from 'components/forms/validator'
import ButtonLink from 'components/layout/ButtonLink'
import Col from 'components/layout/Col'
import Paragraph from 'components/layout/Paragraph'
import Row from 'components/layout/Row'
import ABIService from 'logic/contractInteraction/sources/ABIService'
import { styles } from 'routes/safe/components/Balances/SendModal/screens/ContractInteraction/style'
import { safeSelector } from 'routes/safe/store/selectors'

const useStyles = makeStyles(styles)

const EthValue = ({ onSetMax }) => {
  const classes = useStyles()
  const { ethBalance } = useSelector(safeSelector)
  const {
    input: { value: method },
  } = useField('selectedMethod', { value: true })
  const disabled = !ABIService.isPayable(method)

  return (
    <>
      <Row className={classes.fullWidth} margin="xs">
        <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
          Value
        </Paragraph>
        <ButtonLink
          color={disabled ? 'disabled' : 'secondary'}
          onClick={() => !disabled && onSetMax(ethBalance)}
          weight="bold"
        >
          Send max
        </ButtonLink>
      </Row>
      <Row margin="md">
        <Col>
          <Field
            className={classes.addressInput}
            component={TextField}
            disabled={disabled}
            inputAdornment={{
              endAdornment: <InputAdornment position="end">ETH</InputAdornment>,
              disabled,
            }}
            name="value"
            placeholder="Value"
            text="Value"
            type="text"
            validate={!disabled && composeValidators(mustBeFloat, maxValue(ethBalance))}
          />
        </Col>
      </Row>
    </>
  )
}

export default EthValue
