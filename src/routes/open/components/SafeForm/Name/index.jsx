// @flow
import * as React from 'react'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { required } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import { FIELD_NAME } from '~/routes/open/components/fields'

const Name = () => (
  <Block margin="md">
    <Field
      name={FIELD_NAME}
      component={TextField}
      type="text"
      validate={required}
      placeholder="Safe name*"
      text="Safe name"
    />
  </Block>
)

export default Name
