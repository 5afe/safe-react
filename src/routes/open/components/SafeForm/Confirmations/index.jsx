// @flow
import * as React from 'react'
import { Field } from 'react-final-form'
import TextField from '~/components/forms/TextField'
import { composeValidators, minValue, mustBeNumber, required } from '~/components/forms/validator'
import Block from '~/components/layout/Block'

const Confirmations = () => (
  <Block margin="md">
    <Field
      name="confirmations"
      component={TextField}
      type="text"
      validate={composeValidators(
        required,
        mustBeNumber,
        minValue(1),
      )}
      placeholder="Required confirmations*"
      text="Required confirmations"
    />
  </Block>
)

export default Confirmations
