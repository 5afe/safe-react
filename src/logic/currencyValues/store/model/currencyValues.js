// @flow
import type { RecordOf } from 'immutable'
import { Record } from 'immutable'

export const AVAILABLE_CURRENCIES = {
  USD: 'USD',
  EUR: 'EUR',
}


export type BalanceCurrencyType = {
  currencyName: string;
  tokenAddress: string,
  balanceInCurrency: string,
}

export const makeBalanceCurrency = Record({
  currencyName: '',
  tokenAddress: '',
  balanceInCurrency: '',
})

export type CurrencyValuesProps = {
  currencyValueSelected: string;
  currencyValuesList: BalanceCurrencyType[]
}

export type CurrencyValues = RecordOf<CurrencyValuesProps>
