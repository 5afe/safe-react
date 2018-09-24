// @flow
import * as React from 'react'
import Block from '~/components/layout/Block'
import { getAccountsFrom } from '~/routes/open/utils/safeDataExtractor'
import Owners from './Owners'
import Confirmations from './Confirmations'
import DailyLimit from './DailyLimit'

export const CONFIRMATIONS_ERROR = 'Number of confirmations can not be higher than the number of owners'

export const safeFieldsValidation = (values: Object) => {
  const errors = {}

  if (Number.parseInt(values.owners, 10) < Number.parseInt(values.confirmations, 10)) {
    errors.confirmations = CONFIRMATIONS_ERROR
  }

  return errors
}

export default () => (constrols: React$Node, { values }: Object) => (
  <Block margin="md">
    <Owners numOwners={values.owners} otherAccounts={getAccountsFrom(values)} />
    <Confirmations />
    <DailyLimit />
  </Block>
)
