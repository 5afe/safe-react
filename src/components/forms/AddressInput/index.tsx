import { useEffect, useState } from 'react'
import { Field } from 'react-final-form'
import { OnChange } from 'react-final-form-listeners'
import InputAdornment from '@material-ui/core/InputAdornment'
import CircularProgress from '@material-ui/core/CircularProgress'

import TextField from 'src/components/forms/TextField'
import { Validator, composeValidators, mustBeEthereumAddress, required } from 'src/components/forms/validator'
import { trimSpaces } from 'src/utils/strings'
import { getAddressFromDomain } from 'src/logic/wallets/getWeb3'
import { isValidEnsName, isValidCryptoDomainName } from 'src/logic/wallets/ethAddresses'
import { checksumAddress } from 'src/utils/checksumAddress'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { parsePrefixedAddress } from 'src/utils/prefixedAddress'

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
}: AddressInputProps): React.ReactElement => {
  const [currentInput, setCurrentInput] = useState<string>('')
  const [resolutions, setResolutions] = useState<Record<string, string | undefined>>({})
  const resolvedAddress = resolutions[currentInput]
  const isResolving = resolvedAddress === ''

  useEffect(() => {
    if (resolvedAddress) {
      fieldMutator(resolvedAddress)
    }
  }, [resolvedAddress, fieldMutator])

  const adornment = isResolving
    ? {
        endAdornment: (
          <InputAdornment position="end">
            <CircularProgress size="16px" />
          </InputAdornment>
        ),
      }
    : inputAdornment

  const getValidationError = composeValidators(required, mustBeEthereumAddress, ...validators)

  return (
    <>
      <Field
        className={className}
        component={TextField as any}
        defaultValue={defaultValue}
        disabled={disabled}
        inputAdornment={adornment}
        name={name}
        placeholder={placeholder}
        testId={testId}
        text={text}
        type="text"
        spellCheck={false}
        validate={getValidationError}
      />
      <OnChange name={name}>
        {async (value: string) => {
          const address = trimSpaces(value)
          setCurrentInput(address)

          // A crypto domain name
          if (isValidEnsName(address) || isValidCryptoDomainName(address)) {
            setResolutions((prev) => ({ ...prev, [address]: '' }))
            try {
              const resolverAddr = await getAddressFromDomain(address)
              const formattedAddress = checksumAddress(resolverAddr)
              setResolutions((prev) => ({ ...prev, [address]: formattedAddress }))
            } catch (err) {
              setResolutions((prev) => ({ ...prev, [address]: undefined }))
              logError(Errors._101, err.message)
            }
          } else {
            // A regular address hash
            if (!getValidationError(address)) {
              const parsed = parsePrefixedAddress(address)
              const checkedAddress = checksumAddress(parsed.address) || parsed.address

              // FIXME: this'll remove the prefix
              fieldMutator(checkedAddress)
            }
          }
        }}
      </OnChange>
    </>
  )
}

export default AddressInput
