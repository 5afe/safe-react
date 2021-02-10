import { BigNumber } from 'bignumber.js'

import { getNetworkInfo } from 'src/config'
import {
  Custom,
  isCustomTxInfo,
  isTransferTxInfo,
  Transaction,
  TransactionInfo,
  Transfer,
} from 'src/logic/safe/store/models/types/gateway.d'
import { SafeModuleTransaction } from 'src/logic/safe/store/models/types/transaction'

import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { sameString } from 'src/utils/strings'

export const TX_TABLE_ID = 'id'
export const TX_TABLE_TYPE_ID = 'type'
export const TX_TABLE_DATE_ID = 'date'
export const TX_TABLE_AMOUNT_ID = 'amount'
export const TX_TABLE_STATUS_ID = 'status'
export const TX_TABLE_RAW_TX_ID = 'tx'
export const TX_TABLE_RAW_CANCEL_TX_ID = 'cancelTx'
export const TX_TABLE_EXPAND_ICON = 'expand'

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

export const getTxAmount = (txInfo?: TransactionInfo, formatted = true): string => {
  if (!txInfo || !isTransferTxInfo(txInfo)) {
    return NOT_AVAILABLE
  }

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

const { nativeCoin } = getNetworkInfo()

type txTokenData = {
  address: string
  value: string
  decimals: number | null
}

export const getTxTokenData = (txInfo: Transfer): txTokenData => {
  switch (txInfo.transferInfo.type) {
    case 'ERC20':
      return {
        address: txInfo.transferInfo.tokenAddress,
        value: txInfo.transferInfo.value,
        decimals: txInfo.transferInfo.decimals,
      }
    case 'ERC721':
      return { address: txInfo.transferInfo.tokenAddress, value: txInfo.transferInfo.value, decimals: 0 }
    default:
      return { address: nativeCoin.address, value: txInfo.transferInfo.value, decimals: nativeCoin.decimals }
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

// TODO: isCancel
//  how can we be sure that it's a cancel tx without asking for tx-details?
//  can the client-gateway service provide info about the tx, Like: `isCancelTransaction: boolean`?
//  it will be solved as part of: https://github.com/gnosis/safe-client-gateway/issues/255
export const isCancelTransaction = ({ txInfo, safeAddress }: { txInfo: Custom; safeAddress: string }): boolean =>
  sameAddress(txInfo.to, safeAddress) &&
  sameString(txInfo.dataSize, '0') &&
  sameString(txInfo.value, '0') &&
  txInfo.methodName === null

type IsCancelTxDetailsProps = {
  executedAt: number | null
  txInfo: Transaction['txInfo']
  safeAddress: string
}
export const isCancelTxDetails = ({ executedAt, txInfo, safeAddress }: IsCancelTxDetailsProps): boolean =>
  !executedAt &&
  // custom transaction
  isCustomTxInfo(txInfo) &&
  // verify that it's a cancel tx based on it's info
  isCancelTransaction({ safeAddress, txInfo })

export const addressInList = (list: string[] = []) => (address: string): boolean =>
  list.some((ownerAddress) => sameAddress(ownerAddress, address))
