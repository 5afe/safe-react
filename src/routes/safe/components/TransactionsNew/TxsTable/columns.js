// @flow
import { format, getTime } from 'date-fns'
import { List } from 'immutable'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { type SortRow, buildOrderFieldFrom } from '~/components/Table/sorting'
import { type Column } from '~/components/Table/TableHead'
import Web3Integration from '~/logic/wallets/web3Integration'

export const TX_TABLE_NONCE_ID = 'nonce'
export const TX_TABLE_TYPE_ID = 'type'
export const TX_TABLE_DATE_ID = 'date'
export const TX_TABLE_AMOUNT_ID = 'amount'
export const TX_TABLE_STATUS_ID = 'status'
export const TX_TABLE_RAW_TX_ID = 'tx'
export const TX_TABLE_EXPAND_ICON = 'expand'

const { web3 } = Web3Integration
const { toBN, fromWei } = web3.utils

type TxData = {
  nonce: number,
  type: string,
  date: string,
  amount: number | string,
  tx: Transaction,
  status?: string,
}

export const formatDate = (date: Date): string => format(date, 'MMM D, YYYY - HH:mm:ss')

export const getTxAmount = (tx: Transaction) => {
  let txAmount = 'n/a'

  if (tx.isTokenTransfer && tx.decodedParams) {
    txAmount = `${fromWei(toBN(tx.decodedParams.value), 'ether')} ${tx.symbol}`
  } else if (Number(tx.value) > 0) {
    txAmount = `${fromWei(toBN(tx.value), 'ether')} ${tx.symbol}`
  }

  return txAmount
}

export type TransactionRow = SortRow<TxData>

export const getTxTableData = (transactions: List<Transaction>): List<TransactionRow> => {
  const rows = transactions.map((tx: Transaction) => {
    const txDate = tx.isExecuted ? tx.executionDate : tx.submissionDate
    let txType = 'Outgoing transfer'
    if (tx.modifySettingsTx) {
      txType = 'Modify Safe Settings'
    } else if (tx.cancellationTx) {
      txType = 'Cancellation transaction'
    }

    return {
      [TX_TABLE_NONCE_ID]: tx.nonce,
      [TX_TABLE_TYPE_ID]: txType,
      [TX_TABLE_DATE_ID]: formatDate(tx.isExecuted ? tx.executionDate : tx.submissionDate),
      [buildOrderFieldFrom(TX_TABLE_DATE_ID)]: getTime(txDate),
      [TX_TABLE_AMOUNT_ID]: getTxAmount(tx),
      [TX_TABLE_STATUS_ID]: tx.status,
      [TX_TABLE_RAW_TX_ID]: tx,
    }
  })

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
    width: 200,
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
    disablePadding: false,
    order: true,
    label: 'Date',
    custom: false,
  }

  const statusColumn: Column = {
    id: TX_TABLE_STATUS_ID,
    order: false,
    disablePadding: false,
    label: 'Status',
    custom: true,
  }

  const expandIconColumn: Column = {
    id: TX_TABLE_EXPAND_ICON,
    order: false,
    disablePadding: true,
    label: '',
    custom: true,
    width: 50,
    static: true,
  }

  return List([nonceColumn, typeColumn, valueColumn, dateColumn, statusColumn, expandIconColumn])
}
