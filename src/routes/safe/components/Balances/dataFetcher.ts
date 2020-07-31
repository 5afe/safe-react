import { BigNumber } from 'bignumber.js'
import { List } from 'immutable'

import { FIXED } from 'src/components/Table/sorting'
import { formatAmountInUsFormat } from 'src/logic/tokens/utils/formatAmount'
import { ETH_ADDRESS } from 'src/logic/tokens/utils/tokenHelpers'
import { TableColumn } from 'src/components/Table/types'
import { AVAILABLE_CURRENCIES, BalanceCurrencyRecord } from 'src/logic/currencyValues/store/model/currencyValues'
import { Token } from 'src/logic/tokens/store/model/token'
import { BalanceDataRow } from './Coins'

export const BALANCE_TABLE_ASSET_ID = 'asset'
export const BALANCE_TABLE_BALANCE_ID = 'balance'
export const BALANCE_TABLE_VALUE_ID = 'value'

const getTokenPriceInCurrency = (
  token: Token,
  currencySelected: AVAILABLE_CURRENCIES,
  currencyValues: List<BalanceCurrencyRecord>,
  currencyRate: number | null,
): string => {
  if (!currencySelected) {
    return ''
  }

  const currencyValue = currencyValues.find(({ tokenAddress }) => {
    if (token.address === ETH_ADDRESS && !tokenAddress) {
      return true
    }

    return token.address === tokenAddress
  })

  if (!currencyValue) {
    return ''
  }

  const { balanceInBaseCurrency } = currencyValue
  const balance = new BigNumber(balanceInBaseCurrency).times(currencyRate).toFixed(2)

  return `${formatAmountInUsFormat(balance)} ${currencySelected}`
}

export const getBalanceData = (
  activeTokens: List<Token>,
  currencySelected: AVAILABLE_CURRENCIES,
  currencyValues: List<BalanceCurrencyRecord>,
  currencyRate: number,
): BalanceDataRow => {
  return activeTokens.map((token) => ({
    [BALANCE_TABLE_ASSET_ID]: {
      name: token.name,
      logoUri: token.logoUri,
      address: token.address,
      symbol: token.symbol,
    },
    assetOrder: token.name,
    [BALANCE_TABLE_BALANCE_ID]: `${formatAmountInUsFormat(token.balance.toString())} ${token.symbol}`,
    balanceOrder: Number(token.balance),
    [FIXED]: token.symbol === 'ETH',
    [BALANCE_TABLE_VALUE_ID]: getTokenPriceInCurrency(token, currencySelected, currencyValues, currencyRate),
  }))
}

export const generateColumns = (): List<TableColumn> => {
  const assetColumn: TableColumn = {
    id: BALANCE_TABLE_ASSET_ID,
    order: true,
    disablePadding: false,
    label: 'Asset',
    custom: false,
    width: 250,
  }

  const balanceColumn: TableColumn = {
    id: BALANCE_TABLE_BALANCE_ID,
    align: 'right',
    order: true,
    disablePadding: false,
    label: 'Balance',
    custom: false,
  }

  const actions: TableColumn = {
    id: 'actions',
    order: false,
    disablePadding: false,
    label: '',
    custom: true,
    static: true,
  }

  const value: TableColumn = {
    id: BALANCE_TABLE_VALUE_ID,
    order: false,
    label: 'Value',
    custom: false,
    static: true,
    disablePadding: false,
    style: {
      fontSize: '11px',
      color: '#5d6d74',
      borderBottomWidth: '2px',
      width: '125px',
      fontFamily: 'Averta',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'right',
    },
  }

  return List([assetColumn, balanceColumn, value, actions])
}
