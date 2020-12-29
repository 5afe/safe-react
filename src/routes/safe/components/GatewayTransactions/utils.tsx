import { BigNumber } from 'bignumber.js'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { Transaction, Transfer } from 'src/logic/safe/store/models/types/gateway'
import { SafeModuleTransaction } from 'src/logic/safe/store/models/types/transaction'

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
  { decimals = 0, symbol = NOT_AVAILABLE, value }: AmountData,
  formatted = false,
): string => {
  const nonFormattedValue = new BigNumber(value).times(`1e-${decimals}`).toFixed()
  const finalValue = formatted ? formatAmount(nonFormattedValue).toString() : nonFormattedValue
  const txAmount = finalValue === 'NaN' ? NOT_AVAILABLE : finalValue

  return `${txAmount} ${symbol}`
}

export const getTxAmount = (tx: Transaction, formatted = true): string => {
  const txInfo = tx.txInfo as Transfer
  if (!txInfo.direction) return ''

  return getAmountWithSymbol(
    {
      decimals: txInfo.transferInfo.decimals ? txInfo.transferInfo.decimals.toString() : '18',
      symbol: txInfo.transferInfo.tokenSymbol ? (txInfo.transferInfo.tokenSymbol as string) : 'ETH',
      value: txInfo.transferInfo.value,
    },
    formatted,
  )
}

export interface TableData {
  amount: string
  cancelTx?: Transaction
  date: string
  dateOrder?: number
  id: string
  status: string
  tx: Transaction | SafeModuleTransaction
  type: any
}
