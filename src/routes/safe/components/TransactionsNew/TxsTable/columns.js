// @flow
import { List } from 'immutable'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { buildOrderFieldFrom, FIXED, type SortRow } from '~/components/Table/sorting'
import { type Column } from '~/components/Table/TableHead'

export const TX_TABLE_NONCE_ID = 'nonce'
export const TX_TABLE_TYPE_ID = 'type'
export const TX_TABLE_DATE_ID = 'date'
export const TX_TABLE_AMOUNT_ID = 'amount'
export const TX_TABLE_STATUS_ID = 'status'

type BalanceData = {
  asset: Object,
  balance: string,
}

export type BalanceRow = SortRow<BalanceData>

export const getBalanceData = (activeTokens: List<Token>): List<BalanceRow> => {
  const rows = activeTokens.map((token: Token) => ({
    [BALANCE_TABLE_ASSET_ID]: { name: token.name, logoUri: token.logoUri },
    [buildOrderFieldFrom(BALANCE_TABLE_ASSET_ID)]: token.name,
    [BALANCE_TABLE_BALANCE_ID]: `${token.balance} ${token.symbol}`,
    [buildOrderFieldFrom(BALANCE_TABLE_BALANCE_ID)]: Number(token.balance),
    [FIXED]: token.get('symbol') === 'ETH',
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
  }

  return List([assetColumn, balanceColumn, actions])
}
