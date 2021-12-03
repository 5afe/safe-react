import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'

// If this is in the index.ts file, it causes a circular dependency
// CGW does not return `nativeCurrency.address` as it is `ZERO_ADDRESS`
export const getNativeCurrencyAddress = (): string => {
  return ZERO_ADDRESS
}

// Template syntax returned from CGW is {{this}}
export const evalTemplate = (uri: string, data: string | Record<string, string>): string => {
  const TEMPLATE_REGEX = /\{\{([^}]+)\}\}/g
  return uri.replace(TEMPLATE_REGEX, (_: string, key: string) => data[key])
}
