import { ReactElement, useEffect, useState } from 'react'
import { Field, useFormState } from 'react-final-form'
import InputAdornment from '@material-ui/core/InputAdornment'
import CircularProgress from '@material-ui/core/CircularProgress'

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
  inputAdornment?: { endAdornment: ReactElement } | undefined | false
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
}: AddressInputProps): ReactElement => {
  const { values } = useFormState()
  const address = trimSpaces(values[name])

  const [showLoadingSpinner, setShowLoadingSpinner] = useState<boolean>(false)

  useEffect(() => {
    let isCurrentResolution = true
    const handleAddressInput = async () => {
      // A crypto domain name
      if (isValidEnsName(address) || isValidCryptoDomainName(address)) {
        setShowLoadingSpinner(true)
        // Trigger resolution/loading spinner
        try {
          const resolverAddr = await getAddressFromDomain(address)
          const formattedAddress = checksumAddress(resolverAddr)

          // Set field if current resolution in current effect
          if (isCurrentResolution) {
            fieldMutator(formattedAddress)
          }
        } catch (err) {
          logError(Errors._101, err.message)
        } finally {
          setShowLoadingSpinner(false)
        }
      } else {
        // A regular address hash// A regular address hash
        let checkedAddress = address

        // Automatically checksum valid (either already checksummed, or lowercase addresses)
        if (isValidAddress(address)) {
          try {
            checkedAddress = checksumAddress(address)
          } catch {}
        }
        fieldMutator(checkedAddress)
      }
    }
    handleAddressInput()

    return () => {
      // Effect is no longer current when address changes
      isCurrentResolution = false
    }
  }, [address, fieldMutator])

  const adornment = showLoadingSpinner
    ? {
        endAdornment: (
          <InputAdornment position="end">
            <CircularProgress size="16px" />
          </InputAdornment>
        ),
      }
    : inputAdornment

  return (
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
      validate={composeValidators(required, mustBeEthereumAddress, ...validators)}
    />
  )
}

export default AddressInput
