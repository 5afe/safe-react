import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'

// If this is in the index.ts file, it causes a circular dependency
// CGW does not return `nativeCurrency.address` as it is `ZERO_ADDRESS`
export const getNativeCurrencyAddress = (): string => {
  return ZERO_ADDRESS
}
