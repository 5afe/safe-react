// @flow
import { format } from 'date-fns'
import { List } from 'immutable'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { type SortRow } from '~/components/Table/sorting'
import { type Column } from '~/components/Table/TableHead'
import { getWeb3 } from '~/logic/wallets/getWeb3'

export const TX_TABLE_NONCE_ID = 'nonce'
export const TX_TABLE_TYPE_ID = 'type'
export const TX_TABLE_DATE_ID = 'date'
export const TX_TABLE_AMOUNT_ID = 'amount'
export const TX_TABLE_STATUS_ID = 'status'

const web3 = getWeb3()
const { toBN, fromWei } = web3.utils

type TxData = {
  nonce: number,
  type: string,
  date: Date,
  amount: number | string,
  status: string,
}

const formatDate = date => format(date, 'MMM D, YYYY - h:m:s')

export type BalanceRow = SortRow<TxData>

export const getTxTableData = (transactions: List<Transaction>): List<BalanceRow> => {
  const rows = transactions.map((tx: Transaction) => ({
    [TX_TABLE_NONCE_ID]: tx.nonce,
    [TX_TABLE_TYPE_ID]: 'Outgoing transfer',
    [TX_TABLE_DATE_ID]: formatDate(tx.isExecuted ? tx.executionDate : tx.submissionDate),
    [TX_TABLE_AMOUNT_ID]: Number(tx.value) > 0 ? fromWei(toBN(tx.value), 'ether') : 'n/a',
    [TX_TABLE_STATUS_ID]: tx.isExecuted ? 'done' : 'peding',
  }))

  return rows
}

export const generateColumns = () => {
  const nonceColumn: Column = {
    id: TX_TABLE_NONCE_ID,
    disablePadding: false,
    label: 'Nonce',
    custom: false,
    order: false,
    width: 50,
  }

  const typeColumn: Column = {
    id: TX_TABLE_TYPE_ID,
    order: false,
    disablePadding: false,
    label: 'Type',
    custom: false,
    width: 150,
  }

  const valueColumn: Column = {
    id: TX_TABLE_AMOUNT_ID,
    order: false,
    disablePadding: false,
    label: 'Amount',
    custom: false,
    width: 100,
  }

  const dateColumn: Column = {
    id: TX_TABLE_DATE_ID,
    order: false,
    disablePadding: false,
    label: 'Date',
    custom: false,
  }

  const statusColumn: Column = {
    id: TX_TABLE_STATUS_ID,
    order: false,
    disablePadding: false,
    label: '',
    custom: true,
  }

  return List([nonceColumn, typeColumn, valueColumn, dateColumn, statusColumn])
}
