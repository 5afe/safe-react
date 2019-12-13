// @flow
import type { RecordOf } from 'immutable'
import { Record } from 'immutable'

export const AVAILABLE_CURRENCIES = {
  USD: 'USD',
  EUR: 'EUR',
  CAD: 'CAD',
  HKD: 'HKD',
  ISK: 'ISK',
  PHP: 'PHP',
  DKK: 'DKK',
  HUF: 'HUF',
  CZK: 'CZK',
  AUD: 'AUD',
  RON: 'RON',
  SEK: 'SEK',
  IDR: 'IDR',
  INR: 'INR',
  BRL: 'BRL',
  RUB: 'RUB',
  HRK: 'HRK',
  JPY: 'JPY',
  THB: 'THB',
  CHF: 'CHF',
  SGD: 'SGD',
  PLN: 'PLN',
  BGN: 'BGN',
  TRY: 'TRY',
  CNY: 'CNY',
  NOK: 'NOK',
  NZD: 'NZD',
  ZAR: 'ZAR',
  MXN: 'MXN',
  ILS: 'ILS',
  GBP: 'GBP',
  KRW: 'KRW',
  MYR: 'MYR',
}


export type BalanceCurrencyType = {
  currencyName: AVAILABLE_CURRENCIES;
  tokenAddress: string,
  balanceInBaseCurrency: string,
  balanceInSelectedCurrency: string,
}

export const makeBalanceCurrency = Record({
  currencyName: '',
  tokenAddress: '',
  balanceInBaseCurrency: '',
  balanceInSelectedCurrency: '',
})

export type CurrencyValuesProps = {
  currencyValueSelected: AVAILABLE_CURRENCIES;
  currencyValuesList: BalanceCurrencyType[]
}

export type CurrencyValues = RecordOf<CurrencyValuesProps>
