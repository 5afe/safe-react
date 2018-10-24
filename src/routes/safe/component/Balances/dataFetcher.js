// @flow
import { List } from 'immutable'
import { buildOrderFieldFrom, FIXED, type SortRow } from '~/components/Table/sorting'
import { type Column } from '~/components/Table/TableHead'

export const BALANCE_TABLE_ASSET_ID = 'asset'
export const BALANCE_TABLE_BALANCE_ID = 'balance'
export const BALANCE_TABLE_VALUE_ID = 'value'

export type BalanceRow = SortRow & {
  asset: string,
  balance: string,
  value: string,
}

export const getBalanceData = (): Array<BalanceRow> => [
  {
    [BALANCE_TABLE_ASSET_ID]: 'ABC Periodico',
    [BALANCE_TABLE_BALANCE_ID]: '1.394 ABC',
    [buildOrderFieldFrom(BALANCE_TABLE_BALANCE_ID)]: 1.394,
    [BALANCE_TABLE_VALUE_ID]: '$3.1',
    [buildOrderFieldFrom(BALANCE_TABLE_VALUE_ID)]: 3.1,
  },
  {
    [BALANCE_TABLE_ASSET_ID]: 'Ethereum',
    [BALANCE_TABLE_BALANCE_ID]: '9.394 ETH',
    [buildOrderFieldFrom(BALANCE_TABLE_BALANCE_ID)]: 9.394,
    [BALANCE_TABLE_VALUE_ID]: '$539.45',
    [buildOrderFieldFrom(BALANCE_TABLE_VALUE_ID)]: 539.45,
    [FIXED]: true,
  },
  {
    [BALANCE_TABLE_ASSET_ID]: 'Gnosis',
    [BALANCE_TABLE_BALANCE_ID]: '0.599 GNO',
    [buildOrderFieldFrom(BALANCE_TABLE_BALANCE_ID)]: 0.559,
    [BALANCE_TABLE_VALUE_ID]: '$23.11',
    [buildOrderFieldFrom(BALANCE_TABLE_VALUE_ID)]: 23.11,
  },
  {
    [BALANCE_TABLE_ASSET_ID]: 'OmiseGO',
    [BALANCE_TABLE_BALANCE_ID]: '39.922 OMG',
    [buildOrderFieldFrom(BALANCE_TABLE_BALANCE_ID)]: 39.922,
    [BALANCE_TABLE_VALUE_ID]: '$2930.89',
    [buildOrderFieldFrom(BALANCE_TABLE_VALUE_ID)]: 2930.89,
  },
  {
    [BALANCE_TABLE_ASSET_ID]: 'Moe Feo',
    [BALANCE_TABLE_BALANCE_ID]: '0 MOE',
    [buildOrderFieldFrom(BALANCE_TABLE_BALANCE_ID)]: 0,
    [BALANCE_TABLE_VALUE_ID]: '$0',
    [buildOrderFieldFrom(BALANCE_TABLE_VALUE_ID)]: 0,
  },
]

export const generateColumns = () => {
  const assetRow: Column = {
    id: BALANCE_TABLE_ASSET_ID,
    order: false,
    numeric: false,
    disablePadding: false,
    label: 'Asset',
    custom: false,
  }

  const balanceRow: Column = {
    id: BALANCE_TABLE_BALANCE_ID,
    order: true,
    numeric: true,
    disablePadding: false,
    label: 'Balance',
    custom: false,
  }

  const valueRow: Column = {
    id: BALANCE_TABLE_VALUE_ID,
    order: true,
    numeric: true,
    disablePadding: false,
    label: 'Value',
    custom: false,
  }

  const actions: Column = {
    id: 'actions',
    order: false,
    numeric: false,
    disablePadding: false,
    label: '',
    custom: true,
  }

  return List([assetRow, balanceRow, valueRow, actions])
}

export const filterByZero = (data: Array<BalanceRow>, hideZero: boolean): Array<BalanceRow> =>
  data.filter((row: BalanceRow) => (hideZero ? row[buildOrderFieldFrom(BALANCE_TABLE_BALANCE_ID)] !== 0 : true))
