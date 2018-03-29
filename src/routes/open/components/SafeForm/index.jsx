// @flow
import * as React from 'react'
import Block from '~/components/layout/Block'
import Heading from '~/components/layout/Heading'
import Name from './Name'
import Owners from './Owners'
import Confirmations from './Confirmations'

export const safeFieldsValidation = (values: Object) => {
  const errors = {}

  if (values.owners < values.confirmations) {
    errors.confirmations = 'Number of confirmations can not be higher than the number of owners'
  }

  return errors
}

export default () => ({ values }: Object) => (
  <Block margin="md">
    <Heading tag="h2" margin="lg">Deploy a new Safe</Heading>
    <Name />
    <Owners numOwners={values.owners} />
    <Confirmations />
  </Block>
)
