// @flow
import * as React from 'react'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { composeValidators, mustBeNumber, required, greaterThan, mustBeEthereumAddress } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Heading from '~/components/layout/Heading'
import { DESTINATION_PARAM, VALUE_PARAM } from './withdrawn'

export const CONFIRMATIONS_ERROR = 'Number of confirmations can not be higher than the number of owners'

export const safeFieldsValidation = (values: Object) => {
  const errors = {}

  if (Number.parseInt(values.owners, 10) < Number.parseInt(values.confirmations, 10)) {
    errors.confirmations = CONFIRMATIONS_ERROR
  }

  return errors
}

export default () => () => (
  <Block margin="md">
    <Heading tag="h2" margin="lg">Withdrawn Funds</Heading>
    <Block margin="md">
      <Field
        name={VALUE_PARAM}
        component={TextField}
        type="text"
        validate={composeValidators(required, mustBeNumber, greaterThan(0))}
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
