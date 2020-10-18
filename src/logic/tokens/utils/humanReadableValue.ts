import { BigNumber } from 'bignumber.js'

export const humanReadableValue = (value: number | string, decimals = 18): string => {
  return new BigNumber(value).times(`1e-${decimals}`).toFixed()
}

export const fromTokenUnit = (amount: number | string, decimals: string | number): string =>
  new BigNumber(amount).times(`1e-${decimals}`).toFixed()

export const toTokenUnit = (amount: number | string, decimals: string | number): string => {
  const amountBN = new BigNumber(amount).times(`1e${decimals}`)
  const [, amountDecimalPlaces] = amount.toString().split('.')

  if (amountDecimalPlaces?.length >= +decimals) {
    return amountBN.toFixed(+decimals, BigNumber.ROUND_DOWN)
  }

  return amountBN.toFixed()
}
