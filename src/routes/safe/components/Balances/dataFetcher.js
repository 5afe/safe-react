// 
import { List } from 'immutable'

import { } from '~/components/Table/TableHead'
import { FIXED, buildOrderFieldFrom } from '~/components/Table/sorting'
import { AVAILABLE_CURRENCIES } from '~/logic/currencyValues/store/model/currencyValues'
import { } from '~/logic/tokens/store/model/token'
import { formatAmount } from '~/logic/tokens/utils/formatAmount'
import { ETH_ADDRESS } from '~/logic/tokens/utils/tokenHelpers'

export const BALANCE_TABLE_ASSET_ID = 'asset'
export const BALANCE_TABLE_BALANCE_ID = 'balance'
export const BALANCE_TABLE_VALUE_ID = 'value'



// eslint-disable-next-line max-len
const getTokenPriceInCurrency = (
  token,
  currencySelected,
  currencyValues,
) => {
  if (!currencySelected) {
    return ''
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const tokenPriceIterator of currencyValues) {
    const { balanceInSelectedCurrency, currencyName, tokenAddress } = tokenPriceIterator
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
  activeTokens,
  currencySelected,
  currencyValues,
) => {
  const rows = activeTokens.map((token) => ({
    [BALANCE_TABLE_ASSET_ID]: {
      name: token.name,
      logoUri: token.logoUri,
      address: token.address,
    },
    [buildOrderFieldFrom(BALANCE_TABLE_ASSET_ID)]: token.name,
    [BALANCE_TABLE_BALANCE_ID]: `${formatAmount(token.balance)} ${token.symbol}`,
    [buildOrderFieldFrom(BALANCE_TABLE_BALANCE_ID)]: Number(token.balance),
    [FIXED]: token.get('symbol') === 'ETH',
    [BALANCE_TABLE_VALUE_ID]: getTokenPriceInCurrency(token, currencySelected, currencyValues),
  }))

  return rows
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
