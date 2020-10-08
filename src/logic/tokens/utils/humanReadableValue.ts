import { BigNumber } from 'bignumber.js'

export const humanReadableValue = (value: number | string, decimals = 18): string => {
  return new BigNumber(value).times(`1e-${decimals}`).toFixed()
}

export const fromTokenUnit = (amount: string, decimals: string | number): string =>
  new BigNumber(amount).times(`1e-${decimals}`).toFixed()

export const toTokenUnit = (amount: string, decimals: string | number): string => {
  const amountBN = new BigNumber(amount).times(`1e${decimals}`)
  const [, amountDecimalPlaces] = amount.split('.')

  if (amountDecimalPlaces?.length >= +decimals) {
    return amountBN.toFixed(0, BigNumber.ROUND_DOWN)
  }

  return amountBN.toFixed()
}
