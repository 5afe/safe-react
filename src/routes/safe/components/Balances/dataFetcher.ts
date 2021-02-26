import { BigNumber } from 'bignumber.js'
import { List } from 'immutable'
import { getNetworkInfo } from 'src/config'
import { FIXED } from 'src/components/Table/sorting'
import { formatAmountInUsFormat } from 'src/logic/tokens/utils/formatAmount'
import { TableColumn } from 'src/components/Table/types.d'
import { BalanceCurrencyList } from 'src/logic/currencyValues/store/model/currencyValues'
import { Token } from 'src/logic/tokens/store/model/token'

export const BALANCE_TABLE_ASSET_ID = 'asset'
export const BALANCE_TABLE_BALANCE_ID = 'balance'
export const BALANCE_TABLE_VALUE_ID = 'value'

const { nativeCoin } = getNetworkInfo()

const getTokenValue = (token: Token, currencyValues?: BalanceCurrencyList, currencyRate?: number): string => {
  const currencyValue = currencyValues?.find(({ tokenAddress }) => {
    if (token.address === nativeCoin.address && !tokenAddress) {
      return true
    }

    return token.address === tokenAddress
  })

  if (!currencyValue || !currencyRate) {
    return ''
  }

  const { balanceInBaseCurrency } = currencyValue
  const balance = new BigNumber(balanceInBaseCurrency).times(currencyRate).toString()

  return balance
}

const getTokenPriceInCurrency = (balance: string, currencySelected?: string): string => {
  if (!currencySelected) {
    return Number('').toFixed(2)
  }
  return `${formatAmountInUsFormat(Number(balance).toFixed(2))} ${currencySelected}`
}

export interface BalanceData {
  asset: { name: string; logoUri: string; address: string; symbol: string }
  assetOrder: string
  balance: string
  balanceOrder: number
  fixed: boolean
  value: string
  valueOrder: number
}

export const getBalanceData = (
  activeTokens: List<Token>,
  currencySelected?: string,
  currencyValues?: BalanceCurrencyList,
  currencyRate?: number,
): List<BalanceData> => {
  const { nativeCoin } = getNetworkInfo()
  return activeTokens.map((token) => {
    const balance = getTokenValue(token, currencyValues, currencyRate)
    return {
      [BALANCE_TABLE_ASSET_ID]: {
        name: token.name,
        logoUri: token.logoUri,
        address: token.address,
        symbol: token.symbol,
      },
      assetOrder: token.name,
      [BALANCE_TABLE_BALANCE_ID]: `${formatAmountInUsFormat(token.balance?.toString() || '0')} ${token.symbol}`,
      balanceOrder: Number(token.balance),
      [FIXED]: token.symbol === nativeCoin.symbol,
      [BALANCE_TABLE_VALUE_ID]: getTokenPriceInCurrency(balance, currencySelected),
      valueOrder: Number(balance),
    }
  })
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
    align: 'right',
    order: true,
    label: 'Value',
    custom: false,
    disablePadding: false,
  }

  return List([assetColumn, balanceColumn, value, actions])
}
