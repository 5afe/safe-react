// @flow
import type { RecordOf } from 'immutable'
import { Record } from 'immutable'

type TokenPrice = {
  currencyPrice: string;
  tokenName: string;
  tokenAddress: string;
}

export type CurrencyValuesType = {
  currencyName: string;
  tokensPrice: TokenPrice[]
}

export type CurrencyValuesProps = {
  currencyValueSelected: CurrencyValuesType;
  currencyValuesList: CurrencyValuesType[]
}

export const makeCurrencyValue = Record({
  currencyName: '',
  tokensPrice: [],
})

export type CurrencyValues = RecordOf<CurrencyValuesProps>
