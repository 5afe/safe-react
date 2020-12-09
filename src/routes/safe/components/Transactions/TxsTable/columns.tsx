import { BigNumber } from 'bignumber.js'
import format from 'date-fns/format'
import getTime from 'date-fns/getTime'
import parseISO from 'date-fns/parseISO'
import { List } from 'immutable'
import React, { ReactElement } from 'react'

import TxType from './TxType'

import { buildOrderFieldFrom } from 'src/components/Table/sorting'
import { TableColumn } from 'src/components/Table/types.d'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import {
  SafeModuleTransaction,
  Transaction,
  TransactionStatus,
  TransactionTypes,
} from 'src/logic/safe/store/models/types/transaction'
import { TokenDecodedParams } from 'src/logic/safe/store/models/types/transactions.d'
import { CancellationTransactions } from 'src/logic/safe/store/reducer/cancellationTransactions'
import { getNetworkInfo } from 'src/config'
import { TransactionSummary, Transfer } from 'src/logic/safe/store/models/types/gateway'
import { isGatewayTransaction } from 'src/logic/safe/store/models/types/gatewayHelpers'
import { TokenTransferAmount } from 'src/routes/safe/components/Transactions/List/Row/TokenTransferAmount'

export const TX_TABLE_ID = 'id'
export const TX_TABLE_TYPE_ID = 'type'
export const TX_TABLE_DATE_ID = 'date'
export const TX_TABLE_AMOUNT_ID = 'amount'
export const TX_TABLE_STATUS_ID = 'status'
export const TX_TABLE_RAW_TX_ID = 'tx'
export const TX_TABLE_RAW_CANCEL_TX_ID = 'cancelTx'
export const TX_TABLE_EXPAND_ICON = 'expand'

export const formatDate = (date: string): string => format(parseISO(date), 'MMM d, yyyy - HH:mm:ss')

export const NOT_AVAILABLE = 'n/a'

interface AmountData {
  decimals?: number | string
  symbol?: string
  value: number | string
}

const getAmountWithSymbol = (
  { decimals = '0', symbol = NOT_AVAILABLE, value }: AmountData,
  formatted = false,
): string => {
  const nonFormattedValue = new BigNumber(value).times(`1e-${decimals}`).toFixed()
  const finalValue = formatted ? formatAmount(nonFormattedValue).toString() : nonFormattedValue
  const txAmount = finalValue === 'NaN' ? NOT_AVAILABLE : finalValue

  return `${txAmount} ${symbol}`
}

export const getIncomingTxAmount = (tx: Transfer, formatted = true): string => {
  switch (tx.transferInfo.type) {
    case 'ERC20':
      return getAmountWithSymbol(
        {
          decimals: `${tx.transferInfo.decimals ?? '0'}`,
          symbol: `${tx.transferInfo.tokenSymbol ?? NOT_AVAILABLE}`,
          value: tx.transferInfo.value,
        },
        formatted,
      )
    case 'ERC721':
      // simple workaround to avoid displaying unexpected values for incoming NFT transfer
      return `1 ${tx.transferInfo.tokenSymbol}`
    case 'ETHER': {
      const { nativeCoin } = getNetworkInfo()
      return getAmountWithSymbol(
        {
          decimals: nativeCoin.decimals,
          symbol: nativeCoin.symbol,
          value: tx.transferInfo.value,
        },
        formatted,
      )
    }
    default:
      return NOT_AVAILABLE
  }
}

export const getTxAmount = (tx: Transaction, formatted = true): string => {
  const { decimals = 18, decodedParams, isTokenTransfer, symbol } = tx
  const tokenDecodedTransfer = isTokenTransfer && (decodedParams as TokenDecodedParams)?.transfer
  const { value } = tokenDecodedTransfer || tx

  if (tx.isCollectibleTransfer) {
    return `1 ${tx.symbol}`
  }

  if (!isTokenTransfer && !(Number(value) > 0)) {
    return NOT_AVAILABLE
  }

  return getAmountWithSymbol({ decimals: decimals as string, symbol: symbol as string, value }, formatted)
}

export const getModuleAmount = (tx: SafeModuleTransaction, formatted = true): string => {
  if (tx.type === TransactionTypes.SPENDING_LIMIT && tx.tokenInfo) {
    const { decimals, symbol } = tx.tokenInfo

    let value

    if (tx.dataDecoded) {
      // if `dataDecoded` is defined, then it's a token transfer
      const [, amount] = tx.dataDecoded.parameters
      value = amount.value
    } else {
      // if `dataDecoded` is not defined, then it's an ETH transfer
      value = tx.value
    }

    return getAmountWithSymbol({ decimals, symbol, value }, formatted)
  }

  return NOT_AVAILABLE
}

export const getRawTxAmount = (tx: Transaction): string => {
  const { decimals, decodedParams, isTokenTransfer } = tx
  const { nativeCoin } = getNetworkInfo()
  const tokenDecodedTransfer = isTokenTransfer && (decodedParams as TokenDecodedParams)?.transfer
  const { value } = tokenDecodedTransfer || tx

  if (tx.isCollectibleTransfer) {
    return '1'
  }

  if (!isTokenTransfer && !(Number(value) > 0)) {
    return NOT_AVAILABLE
  }

  const tokenDecimals = decimals ?? nativeCoin.decimals
  const finalValue = new BigNumber(value).times(`1e-${tokenDecimals}`).toFixed()

  return finalValue === 'NaN' ? NOT_AVAILABLE : finalValue
}

export interface TableData {
  [TX_TABLE_ID]: string
  [TX_TABLE_TYPE_ID]: any
  [TX_TABLE_DATE_ID]: string
  dateOrder?: number
  [TX_TABLE_AMOUNT_ID]: string | ReactElement
  [TX_TABLE_STATUS_ID]: string
  [TX_TABLE_RAW_TX_ID]: TransactionSummary | Transaction | SafeModuleTransaction
  [TX_TABLE_RAW_CANCEL_TX_ID]?: Transaction
}

const getModuleTxTableData = (tx: SafeModuleTransaction): TableData => ({
  [TX_TABLE_ID]: `${tx.safeTxHash}-${tx.type}`,
  [TX_TABLE_TYPE_ID]: <TxType txType={tx.type} origin={null} />,
  [TX_TABLE_DATE_ID]: formatDate(tx.executionDate),
  [buildOrderFieldFrom(TX_TABLE_DATE_ID)]: getTime(parseISO(tx.executionDate)),
  [TX_TABLE_AMOUNT_ID]: getModuleAmount(tx),
  [TX_TABLE_STATUS_ID]: tx.status,
  [TX_TABLE_RAW_TX_ID]: tx,
})

const getIncomingTxTableData = (tx: TransactionSummary): TableData => ({
  [TX_TABLE_ID]: `${tx.id}-${tx.txInfo.type}`,
  [TX_TABLE_TYPE_ID]: <TxType txType="incoming" origin={null} />,
  [TX_TABLE_DATE_ID]: formatDate(new Date(tx.timestamp).toISOString()),
  [buildOrderFieldFrom(TX_TABLE_DATE_ID)]: getTime(parseISO(new Date(tx.timestamp).toISOString())),
  [TX_TABLE_AMOUNT_ID]:
    tx.txInfo.type === 'Transfer' ? (
      <TokenTransferAmount
        direction={tx.txInfo.direction}
        transferInfo={tx.txInfo.transferInfo}
        amountWithSymbol={getIncomingTxAmount(tx.txInfo)}
      />
    ) : (
      NOT_AVAILABLE
    ),
  [TX_TABLE_STATUS_ID]: TransactionStatus[tx.txStatus],
  [TX_TABLE_RAW_TX_ID]: tx,
})

// This follows the approach of calculating the tx information closest to the presentation components.
// Instead of populating tx in the store with another flag, Spending Limit tx is inferred here.
const getTxType = (tx: Transaction): TransactionTypes => {
  const SET_ALLOWANCE_HASH = 'beaeb388'
  const DELETE_ALLOWANCE_HASH = '885133e3'

  return tx.data?.includes(SET_ALLOWANCE_HASH) || tx.data?.includes(DELETE_ALLOWANCE_HASH)
    ? TransactionTypes.SPENDING_LIMIT
    : tx.type
}

const getTransactionTableData = (tx: Transaction, cancelTx?: Transaction): TableData => {
  const txDate = tx.submissionDate
  const txType = getTxType(tx)

  return {
    [TX_TABLE_ID]: `${tx.safeTxHash}-${tx.type}`,
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
  transactions: List<Transaction | SafeModuleTransaction | TransactionSummary>,
  cancelTxs: CancellationTransactions,
): List<TableData> =>
  transactions.reduce((acc, tx): List<TableData> => {
    if (isGatewayTransaction(tx)) {
      // TransactionSummary
      if (tx.txInfo.type === 'Transfer') {
        switch (tx.txInfo.direction) {
          case 'INCOMING': {
            return acc.push(getIncomingTxTableData(tx))
          }
          case 'OUTGOING':
          case 'UNKNOWN':
            return acc
        }
      }
    } else {
      const isModuleTx = [TransactionTypes.SPENDING_LIMIT, TransactionTypes.MODULE].includes(tx.type)

      if (isModuleTx) {
        return acc.push(getModuleTxTableData(tx as SafeModuleTransaction))
      }

      return acc.push(getTransactionTableData(tx as Transaction, cancelTxs.get(`${tx.nonce}`)))
    }

    // this line was added due to TS2366 error
    return acc
  }, List([]) as List<TableData>)

export const generateColumns = (): List<TableColumn> => {
  const nonceColumn = {
    id: TX_TABLE_ID,
    disablePadding: false,
    label: 'Id',
    custom: false,
    order: false,
    width: 50,
  }

  const typeColumn = {
    id: TX_TABLE_TYPE_ID,
    order: false,
    disablePadding: false,
    label: 'Type',
    custom: false,
    width: 200,
  }

  const valueColumn = {
    id: TX_TABLE_AMOUNT_ID,
    order: false,
    disablePadding: false,
    label: 'Amount',
    custom: false,
    width: 120,
  }

  const dateColumn = {
    id: TX_TABLE_DATE_ID,
    disablePadding: false,
    order: true,
    label: 'Date',
    custom: false,
  }

  const statusColumn = {
    id: TX_TABLE_STATUS_ID,
    order: false,
    disablePadding: false,
    label: 'Status',
    custom: true,
    align: 'right',
  }

  const expandIconColumn = {
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
