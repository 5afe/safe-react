import memoize from 'lodash/memoize'

import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { getShortName } from 'src/config'
import { isValidAddress } from 'src/utils/isValidAddress'
import { ADDRESS_BOOK_INVALID_NAMES, isValidAddressBookName } from 'src/logic/addressBook/utils'
import { FEATURES } from '@gnosis.pm/safe-react-gateway-sdk'
import { isValidPrefix, parsePrefixedAddress } from 'src/utils/prefixedAddress'
import { hasFeature } from 'src/logic/safe/utils/safeVersion'

type ValidatorReturnType = string | undefined
export type GenericValidatorType = (...args: unknown[]) => ValidatorReturnType
type AsyncValidator = (...args: unknown[]) => Promise<ValidatorReturnType>
export type Validator = GenericValidatorType | AsyncValidator

export const required = (value?: string): ValidatorReturnType => {
  const required = 'Required'

  if (!value) {
    return required
  }

  if (typeof value === 'string' && !value.trim().length) {
    return required
  }

  return undefined
}

export const mustBeInteger = (value: string): ValidatorReturnType =>
  !Number.isInteger(Number(value)) || value.includes('.') ? 'Must be an integer' : undefined

export const mustBeFloat = (value: string): ValidatorReturnType =>
  value && Number.isNaN(Number(value)) ? 'Must be a number' : undefined

export const minValue =
  (min: number | string, inclusive = true) =>
  (value: string): ValidatorReturnType => {
    if (!value) {
      return undefined
    }

    if (Number.parseFloat(value) > Number(min) || (inclusive && Number.parseFloat(value) >= Number(min))) {
      return undefined
    }

    return `Must be greater than ${inclusive ? 'or equal to ' : ''}${min}`
  }

export const maxValue =
  (max: number | string) =>
  (value: string): ValidatorReturnType => {
    if (!max || parseFloat(value) <= parseFloat(max.toString())) {
      return undefined
    }

    return `Maximum value is ${max}`
  }

export const ok = (): undefined => undefined

export const mustBeHexData = (data: string): ValidatorReturnType => {
  const isData = getWeb3().utils.isHexStrict(data)

  if (!isData) {
    return 'Has to be a valid strict hex data (it must start with 0x)'
  }
}

export const mustBeAddressHash = memoize((address: string): ValidatorReturnType => {
  const errorMessage = 'Must be a valid address'
  return isValidAddress(address) ? undefined : errorMessage
})

const mustHaveValidPrefix = (prefix: string): ValidatorReturnType => {
  if (!isValidPrefix(prefix)) {
    return 'Wrong chain prefix'
  }

  if (prefix !== getShortName()) {
    return 'The chain prefix must match the current network'
  }
}

export const mustBeEthereumAddress = (fullAddress: string): ValidatorReturnType => {
  const errorMessage = 'Must be a valid address, ENS or Unstoppable domain'
  const { address, prefix } = parsePrefixedAddress(fullAddress)

  const prefixError = mustHaveValidPrefix(prefix)
  if (prefixError) return prefixError

  const result = mustBeAddressHash(address)
  if (result !== undefined && hasFeature(FEATURES.DOMAIN_LOOKUP)) {
    return errorMessage
  }
  return result
}

export const mustBeEthereumContractAddress = memoize(async (fullAddress: string): Promise<ValidatorReturnType> => {
  const { address } = parsePrefixedAddress(fullAddress)

  const contractCode = await getWeb3().eth.getCode(address)

  const errorMessage = `Must resolve to a valid smart contract address.`

  return !contractCode || contractCode.replace('0x', '').replace(/0/g, '') === '' ? errorMessage : undefined
})

export const minMaxLength =
  (minLen: number, maxLen: number) =>
  (value: string): ValidatorReturnType => {
    const testValue = value || ''
    return testValue.length >= +minLen && testValue.length <= +maxLen
      ? undefined
      : `Should be ${minLen} to ${maxLen} symbols`
  }

export const minMaxDecimalsLength =
  (minLen: number, maxLen: number) =>
  (value: string): ValidatorReturnType => {
    const decimals = value.split('.')[1] || '0'
    const minMaxLengthErrMsg = minMaxLength(minLen, maxLen)(decimals)
    return minMaxLengthErrMsg ? `Should be ${minLen} to ${maxLen} decimals` : undefined
  }

export const ADDRESS_REPEATED_ERROR = 'Address already added'
export const OWNER_ADDRESS_IS_SAFE_ADDRESS_ERROR = 'Cannot use Safe itself as owner.'
export const THRESHOLD_ERROR = 'You cannot set more confirmations than owners'

export const uniqueAddress =
  (addresses: string[] = []) =>
  (address?: string): string | undefined => {
    const addressExists = addresses.some((addressFromList) => sameAddress(addressFromList, address))
    return addressExists ? ADDRESS_REPEATED_ERROR : undefined
  }

export const addressIsNotCurrentSafe =
  (safeAddress: string) =>
  (address?: string): string | undefined =>
    sameAddress(safeAddress, address) ? OWNER_ADDRESS_IS_SAFE_ADDRESS_ERROR : undefined

export const composeValidators =
  (...validators: Validator[]) =>
  (value: unknown): ValidatorReturnType =>
    validators.reduce(
      (error: string | undefined, validator: GenericValidatorType): ValidatorReturnType => error || validator(value),
      undefined,
    )

export const differentFrom =
  (diffValue: number | string) =>
  (value: string): ValidatorReturnType => {
    if (value === diffValue.toString()) {
      return `Value should be different than ${diffValue}`
    }

    return undefined
  }

export const noErrorsOn = (name: string, errors: Record<string, unknown>): boolean => errors[name] === undefined

export const validAddressBookName = (name: string): string | undefined => {
  const lengthError = minMaxLength(1, 50)(name)

  if (lengthError === undefined) {
    return isValidAddressBookName(name)
      ? undefined
      : `Name should not include: ${ADDRESS_BOOK_INVALID_NAMES.join(', ')}`
  }

  return lengthError
}
