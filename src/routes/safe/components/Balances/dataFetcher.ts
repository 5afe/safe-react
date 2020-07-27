import { BigNumber } from 'bignumber.js'
import { List } from 'immutable'

import { buildOrderFieldFrom, FIXED } from 'src/components/Table/sorting'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { ETH_ADDRESS } from 'src/logic/tokens/utils/tokenHelpers'
import { TableColumn } from 'src/components/Table/types'
import { Token } from 'src/logic/tokens/store/model/token'
import { AVAILABLE_CURRENCIES, BalanceCurrencyList } from 'src/logic/currencyValues/store/model/currencyValues'

export const BALANCE_TABLE_ASSET_ID = 'asset'
export const BALANCE_TABLE_BALANCE_ID = 'balance'
export const BALANCE_TABLE_VALUE_ID = 'value'

const getTokenPriceInCurrency = (
  token: Token,
  currencySelected: AVAILABLE_CURRENCIES,
  currencyValues: BalanceCurrencyList,
  currencyRate: number,
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

  return `${balance} ${currencySelected}`
}

export interface BalanceData {
  asset: { name: string; logoUri: string; address: string; symbol: string }
  balance: string
  fixed: boolean
  value: string
}

export const getBalanceData = (
  activeTokens: List<Token>,
  currencySelected: AVAILABLE_CURRENCIES,
  currencyValues: BalanceCurrencyList,
  currencyRate: number,
): List<BalanceData> =>
  activeTokens.map((token) => ({
    [BALANCE_TABLE_ASSET_ID]: {
      name: token.name,
      logoUri: token.logoUri,
      address: token.address,
      symbol: token.symbol,
    },
    [buildOrderFieldFrom(BALANCE_TABLE_ASSET_ID)]: token.name,
    [BALANCE_TABLE_BALANCE_ID]: `${formatAmount(token.balance)} ${token.symbol}`,
    [buildOrderFieldFrom(BALANCE_TABLE_BALANCE_ID)]: Number(token.balance),
    [FIXED]: token.get('symbol') === 'ETH',
    [BALANCE_TABLE_VALUE_ID]: getTokenPriceInCurrency(token, currencySelected, currencyValues, currencyRate),
  }))

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

export const filterByZero = (data: List<BalanceData>, hideZero: boolean): List<BalanceData> =>
  data.filter((row) => (hideZero ? row[buildOrderFieldFrom(BALANCE_TABLE_BALANCE_ID)] !== 0 : true))
