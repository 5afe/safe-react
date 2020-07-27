import { List, Record, RecordOf } from 'immutable'

export enum AVAILABLE_CURRENCIES {
  USD = 'USD',
  EUR = 'EUR',
  CAD = 'CAD',
  HKD = 'HKD',
  ISK = 'ISK',
  PHP = 'PHP',
  DKK = 'DKK',
  HUF = 'HUF',
  CZK = 'CZK',
  AUD = 'AUD',
  RON = 'RON',
  SEK = 'SEK',
  IDR = 'IDR',
  INR = 'INR',
  BRL = 'BRL',
  RUB = 'RUB',
  HRK = 'HRK',
  JPY = 'JPY',
  THB = 'THB',
  CHF = 'CHF',
  SGD = 'SGD',
  PLN = 'PLN',
  BGN = 'BGN',
  TRY = 'TRY',
  CNY = 'CNY',
  NOK = 'NOK',
  NZD = 'NZD',
  ZAR = 'ZAR',
  MXN = 'MXN',
  ILS = 'ILS',
  GBP = 'GBP',
  KRW = 'KRW',
  MYR = 'MYR',
}

type BalanceCurrencyRecord = {
  currencyName?: string
  tokenAddress?: string
  balanceInBaseCurrency: string
  balanceInSelectedCurrency: string
}

export const makeBalanceCurrency = Record<BalanceCurrencyRecord>({
  currencyName: '',
  tokenAddress: '',
  balanceInBaseCurrency: '',
  balanceInSelectedCurrency: '',
})

export type BalanceCurrency = RecordOf<BalanceCurrencyRecord>

export type BalanceCurrencyList = List<BalanceCurrency>

export interface CurrencyRateValue {
  currencyRate?: number
  selectedCurrency?: AVAILABLE_CURRENCIES
  currencyBalances?: BalanceCurrencyList
}
