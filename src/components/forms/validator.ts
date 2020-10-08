import { List } from 'immutable'

import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import memoize from 'lodash.memoize'

type ValidatorReturnType = string | undefined
type GenericValidatorType = (...args: unknown[]) => ValidatorReturnType
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

const regexQuery = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
const url = new RegExp(regexQuery)
export const mustBeUrl = (value: string): ValidatorReturnType => {
  if (url.test(value)) {
    return undefined
  }

  return 'Please, provide a valid url'
}

export const minValue = (min: number | string, inclusive = true) => (value: string): ValidatorReturnType => {
  if (Number.parseFloat(value) > Number(min) || (inclusive && Number.parseFloat(value) >= Number(min))) {
    return undefined
  }

  return `Should be greater than ${inclusive ? 'or equal to ' : ''}${min}`
}

export const maxValue = (max: number | string) => (value: string): ValidatorReturnType => {
  if (!max || parseFloat(value) <= parseFloat(max.toString())) {
    return undefined
  }

  return `Maximum value is ${max}`
}

export const ok = (): undefined => undefined

export const mustBeEthereumAddress = memoize(
  (address: string): ValidatorReturnType => {
    const startsWith0x = address?.startsWith('0x')
    const isAddress = getWeb3().utils.isAddress(address)

    return startsWith0x && isAddress ? undefined : 'Address should be a valid Ethereum address or ENS name'
  },
)

export const mustBeEthereumContractAddress = memoize(
  async (address: string): Promise<ValidatorReturnType> => {
    const contractCode = await getWeb3().eth.getCode(address)

    return !contractCode || contractCode.replace('0x', '').replace(/0/g, '') === ''
      ? 'Address should be a valid Ethereum contract address or ENS name'
      : undefined
  },
)

export const minMaxLength = (minLen: number, maxLen: number) => (value: string): ValidatorReturnType =>
  value.length >= +minLen && value.length <= +maxLen ? undefined : `Should be ${minLen} to ${maxLen} symbols`

export const ADDRESS_REPEATED_ERROR = 'Address already introduced'

export const uniqueAddress = (addresses: string[] | List<string>): GenericValidatorType =>
  memoize(
    (value: string): ValidatorReturnType => {
      const addressAlreadyExists = addresses.some((address) => sameAddress(value, address))
      return addressAlreadyExists ? ADDRESS_REPEATED_ERROR : undefined
    },
  )

export const composeValidators = (...validators: Validator[]) => (value: unknown): ValidatorReturnType =>
  validators.reduce(
    (error: string | undefined, validator: GenericValidatorType): ValidatorReturnType => error || validator(value),
    undefined,
  )

export const differentFrom = (diffValue: number | string) => (value: string): ValidatorReturnType => {
  if (value === diffValue.toString()) {
    return `Value should be different than ${diffValue}`
  }

  return undefined
}

export const noErrorsOn = (name: string, errors: Record<string, unknown>): boolean => errors[name] === undefined
