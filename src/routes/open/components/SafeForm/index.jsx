// @flow
import * as React from 'react'
import Block from '~/components/layout/Block'
import Heading from '~/components/layout/Heading'
import { getAccountsFrom } from '~/routes/open/utils/safeDataExtractor'
import Name from './Name'
import Owners from './Owners'
import Confirmations from './Confirmations'

export const CONFIRMATIONS_ERROR = 'Number of confirmations can not be higher than the number of owners'

export const safeFieldsValidation = (values: Object) => {
  const errors = {}

  if (values.owners < values.confirmations) {
    errors.confirmations = CONFIRMATIONS_ERROR
  }

  return errors
}

export default () => ({ values }: Object) => (
  <Block margin="md">
    <Heading tag="h2" margin="lg">Deploy a new Safe</Heading>
    <Name />
    <Owners numOwners={values.owners} otherAccounts={getAccountsFrom(values)} />
    <Confirmations />
  </Block>
)
