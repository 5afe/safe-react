import { BigNumber } from 'bignumber.js'

export const humanReadableValue = (value: number | string, decimals = 18): string => {
  return new BigNumber(value).times(`1e-${decimals}`).toFixed()
}
