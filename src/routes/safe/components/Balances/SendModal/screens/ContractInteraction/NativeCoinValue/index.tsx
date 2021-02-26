import InputAdornment from '@material-ui/core/InputAdornment'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useField } from 'react-final-form'
import { useSelector } from 'react-redux'

import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import { composeValidators, maxValue, mustBeFloat } from 'src/components/forms/validator'
import ButtonLink from 'src/components/layout/ButtonLink'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { isPayable } from 'src/logic/contractInteraction/sources/ABIService'
import { styles } from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/style'
import { safeSelector } from 'src/logic/safe/store/selectors'
import { getNetworkInfo } from 'src/config'

const useStyles = makeStyles(styles)

interface NativeCoinValueProps {
  onSetMax: (nativeCoinBalance: string) => void
}

const { nativeCoin } = getNetworkInfo()

export const NativeCoinValue = ({ onSetMax }: NativeCoinValueProps): React.ReactElement | null => {
  const classes = useStyles()
  const { ethBalance } = useSelector(safeSelector) || {}

  const {
    input: { value: method },
  } = useField('selectedMethod', { subscription: { value: true } })
  const disabled = !isPayable(method)

  if (!ethBalance) {
    return null
  }

  return disabled ? null : (
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
            component={TextField}
            disabled={disabled}
            inputAdornment={{
              endAdornment: <InputAdornment position="end">{nativeCoin.name}</InputAdornment>,
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
