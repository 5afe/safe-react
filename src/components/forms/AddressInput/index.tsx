import * as React from 'react'
import { Field } from 'react-final-form'
import { OnChange } from 'react-final-form-listeners'

import TextField from 'src/components/forms/TextField'
import { Validator, composeValidators, mustBeEthereumAddress, required } from 'src/components/forms/validator'
import { trimSpaces } from 'src/utils/strings'
import { getAddressFromDomain } from 'src/logic/wallets/getWeb3'
import { isValidEnsName, isValidCryptoDomainName } from 'src/logic/wallets/ethAddresses'
import { checksumAddress } from 'src/utils/checksumAddress'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { isValidAddress } from 'src/utils/isValidAddress'

// an idea for second field was taken from here
// https://github.com/final-form/react-final-form-listeners/blob/master/src/OnBlur.js

export interface AddressInputProps {
  fieldMutator: (address: string) => void
  name?: string
  text?: string
  placeholder?: string
  inputAdornment?: { endAdornment: React.ReactElement } | undefined | false
  testId: string
  validators?: Validator[]
  defaultValue?: string
  disabled?: boolean
  spellCheck?: boolean
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
      spellCheck={false}
      validate={composeValidators(required, mustBeEthereumAddress, ...validators)}
    />
    <OnChange name={name}>
      {async (value: string) => {
        const address = trimSpaces(value)
        // A crypto domain name
        if (isValidEnsName(address) || isValidCryptoDomainName(address)) {
          try {
            const resolverAddr = await getAddressFromDomain(address)
            const formattedAddress = checksumAddress(resolverAddr)
            fieldMutator(formattedAddress)
          } catch (err) {
            logError(Errors._101, err.message)
          }
        } else {
          // A regular address hash
          let checkedAddress = address
          // Automatically checksum valid (either already checksummed, or lowercase addresses)
          if (isValidAddress(address)) {
            try {
              checkedAddress = checksumAddress(address)
            } catch (err) {
              // ignore
            }
          }
          fieldMutator(checkedAddress)
        }
      }}
    </OnChange>
  </>
)

export default AddressInput
