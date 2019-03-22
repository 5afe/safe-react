// @flow
import { List } from 'immutable'
import { type Token } from '~/logic/tokens/store/model/token'
import { buildOrderFieldFrom, FIXED, type SortRow } from '~/components/Table/sorting'
import { type Column } from '~/components/Table/TableHead'

export const BALANCE_TABLE_ASSET_ID = 'asset'
export const BALANCE_TABLE_BALANCE_ID = 'balance'
export const BALANCE_TABLE_VALUE_ID = 'value'

type BalanceData = {
  asset: string,
  balance: string,
}

export type BalanceRow = SortRow<BalanceData>

export const getBalanceData = (activeTokens: List<Token>): Array<BalanceRow> => {
  const rows = activeTokens.map((token: Token) => ({
    [BALANCE_TABLE_ASSET_ID]: token.get('name'),
    [BALANCE_TABLE_BALANCE_ID]: `${token.get('funds')} ${token.get('symbol')}`,
    [buildOrderFieldFrom(BALANCE_TABLE_BALANCE_ID)]: Number(token.get('funds')),
    [FIXED]: token.get('symbol') === 'ETH',
  }))

  return Array.from(rows)
}

export const generateColumns = () => {
  const assetRow: Column = {
    id: BALANCE_TABLE_ASSET_ID,
    order: false,
    disablePadding: false,
    label: 'Asset',
    custom: false,
    width: 250,
  }

  const balanceRow: Column = {
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
  }

  return List([assetRow, balanceRow, actions])
}

export const filterByZero = (data: Array<BalanceRow>, hideZero: boolean): Array<BalanceRow> => data.filter((row: BalanceRow) => (hideZero ? row[buildOrderFieldFrom(BALANCE_TABLE_BALANCE_ID)] !== 0 : true))
