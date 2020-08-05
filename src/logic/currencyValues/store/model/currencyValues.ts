import { List, Record, RecordOf } from 'immutable'

export enum AVAILABLE_CURRENCIES {
  ETH = 'ETH',
  USD = 'USD',
  EUR = 'EUR',
  AUD = 'AUD',
  BGN = 'BGN',
  BRL = 'BRL',
  CAD = 'CAD',
  CHF = 'CHF',
  CNY = 'CNY',
  CZK = 'CZK',
  DKK = 'DKK',
  GBP = 'GBP',
  HKD = 'HKD',
  HRK = 'HRK',
  HUF = 'HUF',
  IDR = 'IDR',
  ILS = 'ILS',
  INR = 'INR',
  ISK = 'ISK',
  JPY = 'JPY',
  KRW = 'KRW',
  MXN = 'MXN',
  MYR = 'MYR',
  NOK = 'NOK',
  NZD = 'NZD',
  PHP = 'PHP',
  PLN = 'PLN',
  RON = 'RON',
  RUB = 'RUB',
  SEK = 'SEK',
  SGD = 'SGD',
  THB = 'THB',
  TRY = 'TRY',
  ZAR = 'ZAR',
}

export type BalanceCurrencyRecord = {
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

export type CurrencyRateValueRecord = RecordOf<BalanceCurrencyRecord>

export type BalanceCurrencyList = List<CurrencyRateValueRecord>

export interface CurrencyRateValue {
  currencyRate?: number
  selectedCurrency?: AVAILABLE_CURRENCIES
  currencyBalances?: BalanceCurrencyList
}
