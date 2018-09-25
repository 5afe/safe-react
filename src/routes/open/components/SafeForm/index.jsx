// @flow
import * as React from 'react'
import OpenPaper from '~/routes/open/components/OpenPaper'
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

const SafeRestPage = () => (controls: React$Node, { values }: Object) => (
  <OpenPaper controls={controls}>
    <Owners numOwners={values.owners} otherAccounts={getAccountsFrom(values)} />
    <Confirmations />
    <DailyLimit />
  </OpenPaper>
)

export default SafeRestPage
