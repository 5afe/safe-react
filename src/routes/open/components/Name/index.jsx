// @flow
import * as React from 'react'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { required } from '~/components/forms/validator'
import Block from '~/components/layout/Block'

const Name = () => (
  <Block margin="md">
    <Field name="name" component={TextField} type="text" validate={required} placeholder="Safe name*" />
  </Block>
)

export default Name
