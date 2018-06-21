// @flow
import * as React from 'react'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { composeValidators, inLimit, mustBeFloat, required, greaterThan, mustBeEthereumAddress } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Heading from '~/components/layout/Heading'
import { TX_NAME_PARAM, TX_DESTINATION_PARAM, TX_VALUE_PARAM } from '~/routes/safe/component/AddTransaction/createTransactions'

export const CONFIRMATIONS_ERROR = 'Number of confirmations can not be higher than the number of owners'

export const safeFieldsValidation = (values: Object) => {
  const errors = {}

  if (Number.parseInt(values.owners, 10) < Number.parseInt(values.confirmations, 10)) {
    errors.confirmations = CONFIRMATIONS_ERROR
  }

  return errors
}

type Props = {
  balance: number,
}

const WithdrawForm = ({ balance }: Props) => () => (
  <Block margin="md">
    <Heading tag="h2" margin="lg">
      Multisig Transaction
    </Heading>
    <Heading tag="h4" margin="lg">
      {`Available balance: ${balance} ETH`}
    </Heading>
    <Block margin="md">
      <Field
        name={TX_NAME_PARAM}
        component={TextField}
        type="text"
        validate={required}
        placeholder="Transaction name"
        text="Transaction name"
      />
    </Block>
    <Block margin="md">
      <Field
        name={TX_DESTINATION_PARAM}
        component={TextField}
        type="text"
        validate={composeValidators(required, mustBeEthereumAddress)}
        placeholder="Destination*"
        text="Destination"
      />
    </Block>
    <Block margin="md">
      <Field
        name={TX_VALUE_PARAM}
        component={TextField}
        type="text"
        validate={composeValidators(required, mustBeFloat, greaterThan(0), inLimit(balance, 0, 'available balance'))}
        placeholder="Amount in ETH*"
        text="Amount in ETH"
      />
    </Block>
  </Block>
)

export default WithdrawForm
