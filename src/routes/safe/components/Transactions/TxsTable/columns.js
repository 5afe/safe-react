// @flow
import { BigNumber } from 'bignumber.js'
import { format, getTime, parseISO } from 'date-fns'
import { List, Map } from 'immutable'
import React from 'react'

import TxType from './TxType'

import { type Column } from '~/components/Table/TableHead'
import { type SortRow, buildOrderFieldFrom } from '~/components/Table/sorting'
import { formatAmount } from '~/logic/tokens/utils/formatAmount'
import { INCOMING_TX_TYPES, type IncomingTransaction } from '~/routes/safe/store/models/incomingTransaction'
import { type Transaction } from '~/routes/safe/store/models/transaction'

export const TX_TABLE_ID = 'id'
export const TX_TABLE_TYPE_ID = 'type'
export const TX_TABLE_DATE_ID = 'date'
export const TX_TABLE_AMOUNT_ID = 'amount'
export const TX_TABLE_STATUS_ID = 'status'
export const TX_TABLE_RAW_TX_ID = 'tx'
export const TX_TABLE_RAW_CANCEL_TX_ID = 'cancelTx'
export const TX_TABLE_EXPAND_ICON = 'expand'

type TxData = {
  id: ?number,
  type: React.ReactNode,
  date: string,
  dateOrder?: number,
  amount: number | string,
  tx: Transaction | IncomingTransaction,
  status?: string,
}

export const formatDate = (date: string): string => format(parseISO(date), 'MMM d, yyyy - HH:mm:ss')

type TxValues = {
  value?: string | number,
  decimals?: string | number,
  symbol?: string,
}

const NOT_AVAILABLE = 'n/a'

const getAmountWithSymbol = ({ decimals = 0, symbol = NOT_AVAILABLE, value }: TxValues, useFormatAmount = false) => {
  const nonFormattedValue = BigNumber(value).times(`1e-${decimals}`).toFixed()
  const finalValue = useFormatAmount ? formatAmount(nonFormattedValue).toString() : nonFormattedValue
  const txAmount = finalValue === 'NaN' ? NOT_AVAILABLE : finalValue

  return `${txAmount} ${symbol}`
}

export const getIncomingTxAmount = (tx: IncomingTransaction, useFormatAmount: boolean = true) => {
  // simple workaround to avoid displaying unexpected values for incoming NFT transfer
  if (INCOMING_TX_TYPES[tx.type] === INCOMING_TX_TYPES.ERC721_TRANSFER) {
    return `1 ${tx.symbol}`
  }

  return getAmountWithSymbol(tx, useFormatAmount)
}

export const getTxAmount = (tx: Transaction, useFormatAmount: boolean = true) => {
  const { decimals = 18, decodedParams, isTokenTransfer, symbol } = tx
  const { value } = isTokenTransfer && decodedParams && decodedParams.value ? decodedParams : tx

  if (!isTokenTransfer && !(Number(value) > 0)) {
    return NOT_AVAILABLE
  }

  return getAmountWithSymbol({ decimals, symbol, value }, useFormatAmount)
}

export type TransactionRow = SortRow<TxData>

const getIncomingTxTableData = (tx: IncomingTransaction): TransactionRow => ({
  [TX_TABLE_ID]: tx.blockNumber,
  [TX_TABLE_TYPE_ID]: <TxType txType="incoming" />,
  [TX_TABLE_DATE_ID]: formatDate(tx.executionDate),
  [buildOrderFieldFrom(TX_TABLE_DATE_ID)]: getTime(parseISO(tx.executionDate)),
  [TX_TABLE_AMOUNT_ID]: getIncomingTxAmount(tx),
  [TX_TABLE_STATUS_ID]: tx.status,
  [TX_TABLE_RAW_TX_ID]: tx,
})

const getTransactionTableData = (tx: Transaction, cancelTx: ?Transaction): TransactionRow => {
  const txDate = tx.submissionDate

  let txType = 'outgoing'
  if (tx.modifySettingsTx) {
    txType = 'settings'
  } else if (tx.cancellationTx) {
    txType = 'cancellation'
  } else if (tx.customTx) {
    txType = 'custom'
  } else if (tx.creationTx) {
    txType = 'creation'
  } else if (tx.upgradeTx) {
    txType = 'upgrade'
  }

  return {
    [TX_TABLE_ID]: tx.blockNumber,
    [TX_TABLE_TYPE_ID]: <TxType origin={tx.origin} txType={txType} />,
    [TX_TABLE_DATE_ID]: txDate ? formatDate(txDate) : '',
    [buildOrderFieldFrom(TX_TABLE_DATE_ID)]: txDate ? getTime(parseISO(txDate)) : null,
    [TX_TABLE_AMOUNT_ID]: getTxAmount(tx),
    [TX_TABLE_STATUS_ID]: tx.status,
    [TX_TABLE_RAW_TX_ID]: tx,
    [TX_TABLE_RAW_CANCEL_TX_ID]: cancelTx,
  }
}

export const getTxTableData = (
  transactions: List<Transaction | IncomingTransaction>,
  cancelTxs: List<Transaction>,
): List<TransactionRow> => {
  const cancelTxsByNonce = cancelTxs.reduce((acc, tx) => acc.set(tx.nonce, tx), Map())

  return transactions.map((tx) => {
    if (INCOMING_TX_TYPES[tx.type]) {
      return getIncomingTxTableData(tx)
    }

    return getTransactionTableData(
      tx,
      Number.isInteger(Number.parseInt(tx.nonce, 10)) ? cancelTxsByNonce.get(tx.nonce) : undefined,
    )
  })
}

export const generateColumns = () => {
  const nonceColumn: Column = {
    id: TX_TABLE_ID,
    disablePadding: false,
    label: 'Id',
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
    width: 120,
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
    align: 'right',
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
