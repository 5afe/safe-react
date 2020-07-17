import * as React from 'react'
import { Field } from 'react-final-form'
import { OnChange } from 'react-final-form-listeners'

import TextField from 'src/components/forms/TextField'
import { composeValidators, mustBeEthereumAddress, required } from 'src/components/forms/validator'
import { removeSpaces } from 'src/utils/strings'
import { getAddressFromENS } from 'src/logic/wallets/getWeb3'
import { isValidEnsName } from 'src/logic/wallets/ethAddresses'

// an idea for second field was taken from here
// https://github.com/final-form/react-final-form-listeners/blob/master/src/OnBlur.js

export interface AddressInputProps {
  fieldMutator: (address: string) => void
  name?: string
  text?: string
  placeholder?: string
  inputAdornment?: { endAdornment: React.ReactElement } | undefined
  testId: string
  validators?: Array<(data: string) => string>
  defaultValue?: string
  disabled?: boolean
  className?: string
}

const AddressInput = ({
  className = '',
  name = 'recipientAddress',
  text = 'Recipient*',
  placeholder = 'Recipient*',
  fieldMutator,
  testId,
  inputAdornment,
  validators = [],
  defaultValue,
  disabled,
}: AddressInputProps): React.ReactElement => (
  <>
    <Field
      className={className}
      component={TextField as any}
      defaultValue={defaultValue}
      disabled={disabled}
      inputAdornment={inputAdornment}
      name={name}
      placeholder={placeholder}
      testId={testId}
      text={text}
      type="text"
      validate={composeValidators(required, mustBeEthereumAddress, ...validators)}
    />
    <OnChange name={name}>
      {async (value) => {
        const address = removeSpaces(value)
        if (isValidEnsName(address)) {
          try {
            const resolverAddr = await getAddressFromENS(address)
            fieldMutator(resolverAddr)
          } catch (err) {
            console.error('Failed to resolve address for ENS name: ', err)
          }
        } else fieldMutator(address)
      }}
    </OnChange>
  </>
)

export default AddressInput
