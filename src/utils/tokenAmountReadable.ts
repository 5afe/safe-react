import { BigNumber } from 'bignumber.js'

export const humanReadableTokenAmount = (amount: string, decimals: number): string =>
  new BigNumber(amount).times(`1e-${decimals}`).toFixed()
