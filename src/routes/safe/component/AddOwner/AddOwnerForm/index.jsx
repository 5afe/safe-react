// @flow
import * as React from 'react'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import Checkbox from '~/components/forms/Checkbox'
import { composeValidators, required, mustBeEthereumAddress, uniqueAddress } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Heading from '~/components/layout/Heading'

export const CONFIRMATIONS_ERROR = 'Number of confirmations can not be higher than the number of owners'

export const NAME_PARAM = 'name'
export const OWNER_ADDRESS_PARAM = 'ownerAddress'
export const INCREASE_PARAM = 'increase'

export const safeFieldsValidation = (values: Object) => {
  const errors = {}

  if (Number.parseInt(values.owners, 10) < Number.parseInt(values.confirmations, 10)) {
    errors.confirmations = CONFIRMATIONS_ERROR
  }

  return errors
}

type Props = {
  numOwners: number,
  threshold: number,
  addresses: string[]
}

const AddOwnerForm = ({ addresses, numOwners, threshold }: Props) => () => (
  <Block margin="md">
    <Heading tag="h2" margin="lg">
      Add Owner
    </Heading>
    <Heading tag="h4" margin="lg">
      {`Actual number of owners: ${numOwners}, with threshold: ${threshold}`}
    </Heading>
    <Block margin="md">
      <Field
        name={NAME_PARAM}
        component={TextField}
        type="text"
        validate={required}
        placeholder="Owner Name*"
        text="Owner Name*"
      />
    </Block>
    <Block margin="md">
      <Field
        name={OWNER_ADDRESS_PARAM}
        component={TextField}
        type="text"
        validate={composeValidators(required, mustBeEthereumAddress, uniqueAddress(addresses))}
        placeholder="Owner address*"
        text="Owner address*"
      />
    </Block>
    <Block margin="md">
      <Field
        name={INCREASE_PARAM}
        component={Checkbox}
        type="checkbox"
      />
      <Block>Increase threshold?</Block>
    </Block>
  </Block>
)

export default AddOwnerForm
