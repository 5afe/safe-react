// 
import * as React from 'react'
import { Field } from 'react-final-form'
import { OnChange } from 'react-final-form-listeners'

import TextField from 'src/components/forms/TextField'
import { composeValidators, mustBeEthereumAddress, required } from 'src/components/forms/validator'
import { getAddressFromENS } from 'src/logic/wallets/getWeb3'


const isValidEnsName = (name) => /^([\w-]+\.)+(eth|test|xyz|luxe)$/.test(name)

// an idea for second field was taken from here
// https://github.com/final-form/react-final-form-listeners/blob/master/src/OnBlur.js

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
}) => (
  <>
    <Field
      className={className}
      component={TextField}
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
        if (isValidEnsName(value)) {
          try {
            const resolverAddr = await getAddressFromENS(value)
            fieldMutator(resolverAddr)
          } catch (err) {
            console.error('Failed to resolve address for ENS name: ', err)
          }
        }
      }}
    </OnChange>
  </>
)

export default AddressInput
