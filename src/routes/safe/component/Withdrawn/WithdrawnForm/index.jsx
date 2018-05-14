// @flow
import * as React from 'react'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { composeValidators, mustBeNumber, required, greaterThan, mustBeEthereumAddress } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Heading from '~/components/layout/Heading'
import { DESTINATION_PARAM, VALUE_PARAM } from '~/routes/safe/component/Withdrawn/withdrawn'

export const CONFIRMATIONS_ERROR = 'Number of confirmations can not be higher than the number of owners'

export const safeFieldsValidation = (values: Object) => {
  const errors = {}

  if (Number.parseInt(values.owners, 10) < Number.parseInt(values.confirmations, 10)) {
    errors.confirmations = CONFIRMATIONS_ERROR
  }

  return errors
}

type Props = {
  limit: number,
  spentToday: number,
}

export const inLimit = (limit: number, spentToday: number) => (value: string) => {
  const amount = Number(value)
  const max = limit - spentToday
  if (amount <= max) {
    return undefined
  }

  return `Should not exceed ${max} ETH (amount to reach daily limit)`
}

export default ({ limit, spentToday }: Props) => () => (
  <Block margin="md">
    <Heading tag="h2" margin="lg">
      Withdrawn Funds
    </Heading>
    <Heading tag="h4" margin="lg">
      {`Daily limit ${limit} ETH (spent today: ${spentToday} ETH)`}
    </Heading>
    <Block margin="md">
      <Field
        name={VALUE_PARAM}
        component={TextField}
        type="text"
        validate={composeValidators(required, mustBeNumber, greaterThan(0), inLimit(limit, spentToday))}
        placeholder="Amount in ETH*"
        text="Amount in ETH"
      />
    </Block>
    <Block margin="md">
      <Field
        name={DESTINATION_PARAM}
        component={TextField}
        type="text"
        validate={composeValidators(required, mustBeEthereumAddress)}
        placeholder="Destination*"
        text="Destination"
      />
    </Block>
  </Block>
)

