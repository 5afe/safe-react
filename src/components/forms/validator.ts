import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { getWeb3 } from 'src/logic/wallets/getWeb3'

export const simpleMemoize = (fn) => {
  let lastArg
  let lastResult
  return (arg, ...args) => {
    if (arg !== lastArg) {
      lastArg = arg
      lastResult = fn(arg, ...args)
    }
    return lastResult
  }
}

export const required = (value?: string) => {
  const required = 'Required'

  if (!value) {
    return required
  }

  if (typeof value === 'string' && !value.trim().length) {
    return required
  }

  return undefined
}

export const mustBeInteger = (value: string) =>
  !Number.isInteger(Number(value)) || value.includes('.') ? 'Must be an integer' : undefined

export const mustBeFloat = (value: string) => (value && Number.isNaN(Number(value)) ? 'Must be a number' : undefined)

export const greaterThan = (min: number | string) => (value: string) => {
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

export const minValue = (min: number | string) => (value: string) => {
  if (Number.isNaN(Number(value)) || Number.parseFloat(value) >= Number(min)) {
    return undefined
  }

  return `Should be at least ${min}`
}

export const maxValueCheck = (max: number | string, value: string): string | undefined => {
  if (!max || Number.isNaN(Number(value)) || parseFloat(value) <= parseFloat(max.toString())) {
    return undefined
  }

  return `Maximum value is ${max}`
}

export const maxValue = (max: number | string) => (value: string) => {
  return maxValueCheck(max, value)
}

export const ok = () => undefined

export const mustBeEthereumAddress = simpleMemoize((address: string) => {
  const startsWith0x = address.startsWith('0x')
  const isAddress = getWeb3().utils.isAddress(address)

  return startsWith0x && isAddress ? undefined : 'Address should be a valid Ethereum address or ENS name'
})

export const mustBeEthereumContractAddress = simpleMemoize(async (address: string) => {
  const contractCode = await getWeb3().eth.getCode(address)

  return !contractCode || contractCode.replace('0x', '').replace(/0/g, '') === ''
    ? 'Address should be a valid Ethereum contract address or ENS name'
    : undefined
})

export const minMaxLength = (minLen, maxLen) => (value) =>
  value.length >= +minLen && value.length <= +maxLen ? undefined : `Should be ${minLen} to ${maxLen} symbols`

export const ADDRESS_REPEATED_ERROR = 'Address already introduced'

export const uniqueAddress = (addresses: string[]) =>
  simpleMemoize((value: string[]) => {
    const addressAlreadyExists = addresses.some((address) => sameAddress(value, address))
    return addressAlreadyExists ? ADDRESS_REPEATED_ERROR : undefined
  })

export const composeValidators = (...validators) => (value) =>
  validators.reduce((error, validator) => error || validator(value), undefined)

export const inLimit = (limit, base, baseText, symbol = 'ETH') => (value) => {
  const amount = Number(value)
  const max = limit - base
  if (amount <= max) {
    return undefined
  }

  return `Should not exceed ${max} ${symbol} (amount to reach ${baseText})`
}

export const differentFrom = (diffValue: number | string) => (value: string) => {
  if (value === diffValue.toString()) {
    return `Value should be different than ${value}`
  }

  return undefined
}

export const noErrorsOn = (name, errors) => errors[name] === undefined
