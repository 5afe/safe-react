// @flow
import { getWeb3 } from '~/wallets/getWeb3'
import { type FieldValidator } from 'final-form'

type Field = boolean | string | null | typeof undefined

export const required = (value: Field) => (value ? undefined : 'Required')

export const mustBeInteger = (value: string) =>
  (!Number.isInteger(Number(value)) || value.includes('.') ? 'Must be an integer' : undefined)

export const mustBeFloat = (value: number) =>
  (Number.isNaN(Number(value)) ? 'Must be a number' : undefined)

export const greaterThan = (min: number) => (value: string) => {
  if (Number.isNaN(Number(value)) || Number.parseFloat(value) > Number(min)) {
    return undefined
  }

  return `Should be greater than ${min}`
}

const regexQuery = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
const url = new RegExp(regexQuery)
export const mustBeUrl = (value: string) => {
  if (url.test(value)) {
    return undefined
  }

  return 'Please, provide a valid url'
}

export const minValue = (min: number) => (value: string) => {
  if (Number.isNaN(Number(value)) || Number.parseFloat(value) >= Number(min)) {
    return undefined
  }

  return `Should be at least ${min}`
}

export const maxValue = (max: number) => (value: string) => {
  if (Number.isNaN(Number(value)) || Number.parseInt(value, 10) <= Number(max)) {
    return undefined
  }

  return `Maximum value is ${max}`
}

export const ok = () => undefined

export const mustBeEthereumAddress = (address: Field) => {
  const isAddress: boolean = getWeb3().isAddress(address)

  return isAddress ? undefined : 'Address should be a valid Ethereum address'
}

export const ADDRESS_REPEATED_ERROR = 'Address already introduced'

export const uniqueAddress = (addresses: string[]) => (value: string) =>
  (addresses.includes(value) ? ADDRESS_REPEATED_ERROR : undefined)

export const composeValidators = (...validators: Function[]): FieldValidator => (value: Field) =>
  validators.reduce((error, validator) => error || validator(value), undefined)

export const inLimit = (limit: number, base: number, baseText: string, symbol: string = 'ETH') => (value: string) => {
  const amount = Number(value)
  const max = limit - base
  if (amount <= max) {
    return undefined
  }

  return `Should not exceed ${max} ${symbol} (amount to reach ${baseText})`
}
