// @flow
import { getWeb3 } from '~/wallets/getWeb3'

type Field = boolean | number | string

export const required = (value: Field) => (value ? undefined : 'Required')

export const mustBeNumber = (value: number) =>
  (Number.isNaN(Number(value)) ? 'Must be a number' : undefined)

export const minValue = (min: number) => (value: number) => {
  if (Number.isNaN(Number(value)) || value >= min) {
    return undefined
  }

  return `Should be at least ${min}`
}

export const maxValue = (max: number) => (value: number) => {
  if (Number.isNaN(Number(value)) || value <= max) {
    return undefined
  }

  return `Maximum value is ${max}`
}

export const ok = () => undefined

export const mustBeEthereumAddress = (address: Field) => {
  const isAddress: boolean = getWeb3().isAddress(address)

  return isAddress ? undefined : 'Address should be a valid Ethereum address'
}

export const composeValidators = (...validators: Function[]) => (value: Field) =>
  validators.reduce((error, validator) => error || validator(value), undefined)
