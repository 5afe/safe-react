// @flow
import { List } from 'immutable'
import { type Token } from '~/logic/tokens/store/model/token'
import {
  buildOrderFieldFrom,
  FIXED,
  type SortRow,
} from '~/components/Table/sorting'
import { type Column } from '~/components/Table/TableHead'
import { formatAmount } from '~/logic/tokens/utils/formatAmount'
import type { BalanceCurrencyType } from '~/logic/currencyValues/store/model/currencyValues'
import { AVAILABLE_CURRENCIES } from '~/logic/currencyValues/store/model/currencyValues'
import { ETH_ADDRESS } from '~/logic/tokens/utils/tokenHelpers'

export const BALANCE_TABLE_ASSET_ID = 'asset'
export const BALANCE_TABLE_BALANCE_ID = 'balance'
export const BALANCE_TABLE_VALUE_ID = 'value'

type BalanceData = {
  asset: Object,
  balance: string
}

export type BalanceRow = SortRow<BalanceData>

// eslint-disable-next-line max-len
const getTokenPriceInCurrency = (
  token: Token,
  currencySelected: typeof AVAILABLE_CURRENCIES,
  currencyValues: List<BalanceCurrencyType>,
): string => {
  if (!currencySelected) {
    return ''
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const tokenPriceIterator of currencyValues) {
    const {
      tokenAddress,
      balanceInSelectedCurrency,
      currencyName,
    } = tokenPriceIterator
    if (token.address === tokenAddress && currencySelected === currencyName) {
      const balance = balanceInSelectedCurrency
        ? parseFloat(balanceInSelectedCurrency, 10).toFixed(2)
        : balanceInSelectedCurrency
      return `${balance} ${currencySelected}`
    }
    // ETH token
    if (token.address === ETH_ADDRESS && !tokenAddress) {
      const balance = balanceInSelectedCurrency
        ? parseFloat(balanceInSelectedCurrency, 10).toFixed(2)
        : balanceInSelectedCurrency
      return `${balance} ${currencySelected}`
    }
  }
  return null
}

// eslint-disable-next-line max-len
export const getBalanceData = (
  activeTokens: List<Token>,
  currencySelected: string,
  currencyValues: List<BalanceCurrencyType>,
): List<BalanceRow> => {
  const rows = activeTokens.map((token: Token) => ({
    [BALANCE_TABLE_ASSET_ID]: {
      name: token.name,
      logoUri: token.logoUri,
      address: token.address,
    },
    [buildOrderFieldFrom(BALANCE_TABLE_ASSET_ID)]: token.name,
    [BALANCE_TABLE_BALANCE_ID]: `${formatAmount(token.balance)} ${
      token.symbol
    }`,
    [buildOrderFieldFrom(BALANCE_TABLE_BALANCE_ID)]: Number(token.balance),
    [FIXED]: token.get('symbol') === 'ETH',
    [BALANCE_TABLE_VALUE_ID]: getTokenPriceInCurrency(
      token,
      currencySelected,
      currencyValues,
    ),
  }))

  return rows
}

export const generateColumns = () => {
  const assetColumn: Column = {
    id: BALANCE_TABLE_ASSET_ID,
    order: true,
    disablePadding: false,
    label: 'Asset',
    custom: false,
    width: 250,
  }

  const balanceColumn: Column = {
    id: BALANCE_TABLE_BALANCE_ID,
    align: 'right',
    order: true,
    disablePadding: false,
    label: 'Balance',
    custom: false,
  }

  const actions: Column = {
    id: 'actions',
    order: false,
    disablePadding: false,
    label: '',
    custom: true,
    static: true,
  }

  const value: Column = {
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

// eslint-disable-next-line max-len
export const filterByZero = (
  data: List<BalanceRow>,
  hideZero: boolean,
): List<BalanceRow> => data.filter((row: BalanceRow) => (hideZero ? row[buildOrderFieldFrom(BALANCE_TABLE_BALANCE_ID)] !== 0 : true))
