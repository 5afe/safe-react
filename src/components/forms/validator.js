// @flow
import { getWeb3 } from '~/wallets/getWeb3'

type Field = boolean | string

export const required = (value: Field) => (value ? undefined : 'Required')

export const mustBeNumber = (value: number) =>
  (Number.isNaN(Number(value)) ? 'Must be a number' : undefined)

export const minValue = (min: number) => (value: string) => {
  if (Number.isNaN(Number(value)) || Number.parseInt(value, 10) >= Number(min)) {
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

export const composeValidators = (...validators: Function[]) => (value: Field) =>
  validators.reduce((error, validator) => error || validator(value), undefined)
