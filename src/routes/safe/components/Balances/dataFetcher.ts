import { BigNumber } from 'bignumber.js'
import { List } from 'immutable'

import { buildOrderFieldFrom, FIXED } from 'src/components/Table/sorting'
import { formatAmountInUsFormat } from 'src/logic/tokens/utils/formatAmount'
import { ETH_ADDRESS } from 'src/logic/tokens/utils/tokenHelpers'
import {
  AVAILABLE_CURRENCIES,
  BalanceCurrencyRecord,
} from '../../../../logic/currencyValues/store/model/currencyValues'
import { TokenProps } from '../../../../logic/tokens/store/model/token'
import { BalanceDataRow } from './Coins'

export const BALANCE_TABLE_ASSET_ID = 'asset'
export const BALANCE_TABLE_BALANCE_ID = 'balance'
export const BALANCE_TABLE_VALUE_ID = 'value'

// eslint-disable-next-line max-len
const getTokenPriceInCurrency = (token, currencySelected, currencyValues, currencyRate) => {
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

export const getBalanceData = (
  activeTokens: List<TokenProps>,
  currencySelected: AVAILABLE_CURRENCIES,
  currencyValues: List<BalanceCurrencyRecord>,
  currencyRate: number,
): BalanceDataRow => {
  return activeTokens.map((token) => ({
    [BALANCE_TABLE_ASSET_ID]: {
      name: token.name,
      logoUri: token.logoUri,
      address: token.address,
    },
    [buildOrderFieldFrom(BALANCE_TABLE_ASSET_ID) as string]: token.name as string,
    [buildOrderFieldFrom(BALANCE_TABLE_ASSET_ID) as string]: token.name,
    [BALANCE_TABLE_BALANCE_ID]: `${formatAmountInUsFormat(token.balance)} ${token.symbol}`,
    [buildOrderFieldFrom(BALANCE_TABLE_BALANCE_ID) as string]: Number(token.balance) as number,
    [FIXED]: token.symbol === 'ETH',
    [BALANCE_TABLE_VALUE_ID]: getTokenPriceInCurrency(token, currencySelected, currencyValues, currencyRate),
  })) as BalanceDataRow
}

export const generateColumns = () => {
  const assetColumn = {
    id: BALANCE_TABLE_ASSET_ID,
    order: true,
    disablePadding: false,
    label: 'Asset',
    custom: false,
    width: 250,
  }

  const balanceColumn = {
    id: BALANCE_TABLE_BALANCE_ID,
    align: 'right',
    order: true,
    disablePadding: false,
    label: 'Balance',
    custom: false,
  }

  const actions = {
    id: 'actions',
    order: false,
    disablePadding: false,
    label: '',
    custom: true,
    static: true,
  }

  const value = {
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
export const filterByZero = (data, hideZero) =>
  data.filter((row) => (hideZero ? row[buildOrderFieldFrom(BALANCE_TABLE_BALANCE_ID)] !== 0 : true))
