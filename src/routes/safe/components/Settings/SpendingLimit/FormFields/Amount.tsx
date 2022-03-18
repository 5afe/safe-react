import { ReactElement } from 'react'
import { useField } from 'react-final-form'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import GnoField from 'src/components/forms/Field'
import { composeValidators, minValue, mustBeFloat, required } from 'src/components/forms/validator'
import { extendedSafeTokensSelector } from 'src/routes/safe/container/selector'
import { useStyles } from 'src/routes/safe/components/Settings/SpendingLimit/style'
import TextField from 'src/components/forms/TextField'

export const Field = styled(GnoField)`
  width: 100%;
`

const AmountInput = styled.div`
  grid-area: amountInput;
`

const Amount = (): ReactElement => {
  const classes = useStyles()

  const {
    input: { value: tokenAddress },
  } = useField('token', { subscription: { value: true } })
  const {
    meta: { touched, visited },
  } = useField('amount', { subscription: { touched: true, visited: true } })

  const tokens = useSelector(extendedSafeTokensSelector)

  const selectedTokenRecord = tokens.find((token) => token.address === tokenAddress)

  const validate = (touched || visited) && composeValidators(required, mustBeFloat, minValue(0, false))

  return (
    <AmountInput>
      <Field
        component={TextField}
        label="Amount*"
        name="amount"
        type="text"
        data-testid="amount-input"
        endAdornment={selectedTokenRecord?.symbol}
        className={classes.amountInput}
        validate={validate}
      />
    </AmountInput>
  )
}

export default Amount
