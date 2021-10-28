import * as React from 'react'
import { Field } from 'react-final-form'
import styled from 'styled-components'
import { OnChange } from 'react-final-form-listeners'
import InputAdornment from '@material-ui/core/InputAdornment'
import { useSelector } from 'react-redux'

import {
  Validator,
  composeValidators,
  mustBeEthereumAddress,
  required,
  checkNetworkPrefix,
} from 'src/components/forms/validator'
import TextField from 'src/components/forms/TextField'
import { trimSpaces } from 'src/utils/strings'
import { getAddressFromDomain } from 'src/logic/wallets/getWeb3'
import { isValidEnsName, isValidCryptoDomainName } from 'src/logic/wallets/ethAddresses'
import { checksumAddress } from 'src/utils/checksumAddress'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { isValidAddress } from 'src/utils/isValidAddress'
import { getCurrentShortChainName } from 'src/config'
import { usePrefixedAddress } from 'src/logic/hooks/usePrefixedAddress'
import { showShortNameSelector } from 'src/logic/appearance/selectors'
import { fontColor } from 'src/theme/variables'
import { copyToClipboard } from 'src/utils/clipboard'

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

type PrefixValidationCacheType = {
  address: string
  error: string | undefined
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
  const prefixValidationCache = React.useRef<PrefixValidationCacheType>({
    address: '',
    error: undefined,
  })

  const prefixValidationWithCache = (value) => {
    const addressSplit = value.split(':')
    const hasPrefixDefined = addressSplit.length > 1

    if (hasPrefixDefined) {
      const [, address] = addressSplit

      const validation = checkNetworkPrefix(value)
      // we update the cache
      prefixValidationCache.current = {
        address,
        error: validation,
      }
      return validation
    } else {
      return prefixValidationCache.current.error
    }
  }

  const showChainPrefix = useSelector(showShortNameSelector)
  const { getAddressWithoutPrefix, getAddressToCopy } = usePrefixedAddress()

  const [populatedPrefix, setPopulatedPrefix] = React.useState<string>(() => getCurrentShortChainName())
  const prefixError = populatedPrefix !== getCurrentShortChainName()

  const updatePopulatedPrefix = (value) => {
    const addressSplit = value.split(':')
    const hasPrefixDefined = addressSplit.length > 1
    if (hasPrefixDefined) {
      const newPrefix = addressSplit[0]
      setPopulatedPrefix(newPrefix)
    }
  }

  return (
    <>
      <Field
        className={className}
        component={TextField as any}
        defaultValue={defaultValue}
        disabled={disabled}
        inputProps={{
          'data-testid': testId,
          onCopy: (e) => {
            const address = getAddressToCopy(e.target.value, populatedPrefix)
            copyToClipboard(address)
          },
          onPaste: (e) => {
            e.stopPropagation()
            e.preventDefault()
            const data = e.clipboardData.getData('Text')

            // restore to default when paste
            setPopulatedPrefix(getCurrentShortChainName())
            fieldMutator(data)
          },
        }}
        inputAdornment={{
          ...inputAdornment,
          startAdornment: showChainPrefix && (
            <InputAdornment position="start">
              <NetWorkPrefixLabel error={prefixError}>{populatedPrefix}:</NetWorkPrefixLabel>
            </InputAdornment>
          ),
        }}
        name={name}
        placeholder={placeholder}
        testId={testId}
        text={text}
        type="text"
        spellCheck={false}
        validate={composeValidators(required, prefixValidationWithCache, mustBeEthereumAddress, ...validators)}
      />
      <OnChange name={name}>
        {async (value: string) => {
          const trimmedValue = trimSpaces(value)
          const address = getAddressWithoutPrefix(trimmedValue)
          updatePopulatedPrefix(trimmedValue)

          // A crypto domain name
          if (isValidEnsName(address) || isValidCryptoDomainName(address)) {
            try {
              const resolverAddr = await getAddressFromDomain(address)
              const formattedAddress = checksumAddress(resolverAddr)
              fieldMutator(formattedAddress)
              setPopulatedPrefix(getCurrentShortChainName())
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
}

export default AddressInput

const NetWorkPrefixLabel = styled.span<{ error: boolean }>`
  color: ${(props) => (props.error ? 'red' : fontColor)};
`
