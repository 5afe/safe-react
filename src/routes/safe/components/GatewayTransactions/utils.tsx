import { BigNumber } from 'bignumber.js'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import { getNetworkInfo } from 'src/config'

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

export const getTxAmount = (txInfo: Transfer, formatted = true): string => {
  switch (txInfo.transferInfo.type) {
    case 'ERC20':
      return getAmountWithSymbol(
        {
          decimals: `${txInfo.transferInfo.decimals ?? 0}`,
          symbol: `${txInfo.transferInfo.tokenSymbol ?? NOT_AVAILABLE}`,
          value: txInfo.transferInfo.value,
        },
        formatted,
      )
    case 'ERC721':
      // simple workaround to avoid displaying unexpected values for incoming NFT transfer
      return `1 ${txInfo.transferInfo.tokenSymbol}`
    case 'ETHER': {
      const { nativeCoin } = getNetworkInfo()
      return getAmountWithSymbol(
        {
          decimals: nativeCoin.decimals,
          symbol: nativeCoin.symbol,
          value: txInfo.transferInfo.value,
        },
        formatted,
      )
    }
    default:
      return NOT_AVAILABLE
  }
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
