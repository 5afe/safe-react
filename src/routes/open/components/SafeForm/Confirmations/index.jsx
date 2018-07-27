// @flow
import * as React from 'react'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { composeValidators, minValue, mustBeInteger, required } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import { FIELD_CONFIRMATIONS } from '~/routes/open/components/fields'

const Confirmations = () => (
  <Block margin="md">
    <Field
      name={FIELD_CONFIRMATIONS}
      component={TextField}
      type="text"
      validate={composeValidators(
        required,
        mustBeInteger,
        minValue(1),
      )}
      placeholder="Required confirmations*"
      text="Required confirmations"
    />
  </Block>
)

export default Confirmations
