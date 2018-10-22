// @flow
import { buildOrderFieldFrom } from '~/components/Table/sorting'

export const BALANCE_TABLE_ASSET_ID = 'asset'
export const BALANCE_TABLE_BALANCE_ID = 'balance'
export const BALANCE_TABLE_VALUE_ID = 'value'

export type BalanceRow = {
  asset: string,
  balance: string,
  value: string,
}

export const getBalanceData = (): Array<BalanceRow> => [
  {
    [BALANCE_TABLE_ASSET_ID]: 'Ethereum',
    [BALANCE_TABLE_BALANCE_ID]: '9.394 ETH',
    [buildOrderFieldFrom(BALANCE_TABLE_BALANCE_ID)]: 9.394,
    [BALANCE_TABLE_VALUE_ID]: '$539.45',
    [buildOrderFieldFrom(BALANCE_TABLE_VALUE_ID)]: 539.45,
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

export const filterByZero = (data: Array<BalanceRow>, hideZero: boolean): Array<BalanceRow> =>
  data.filter((row: BalanceRow) => (hideZero ? row[buildOrderFieldFrom(BALANCE_TABLE_BALANCE_ID)] !== 0 : true))
