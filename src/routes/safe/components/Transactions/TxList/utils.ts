import { BigNumber } from 'bignumber.js'

import { getNetworkInfo } from 'src/config'
import {
  isCustomTxInfo,
  isTransferTxInfo,
  Transaction,
  TransactionInfo,
  Transfer,
} from 'src/logic/safe/store/models/types/gateway.d'

import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { sameAddress } from 'src/logic/wallets/ethAddresses'

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

export const isCancelTxDetails = (txInfo: Transaction['txInfo']): boolean =>
  // custom transaction
  isCustomTxInfo(txInfo) &&
  // flag-based identification
  txInfo.isCancellation

export const addressInList = (list: string[] = []) => (address: string): boolean =>
  list.some((ownerAddress) => sameAddress(ownerAddress, address))

export const getTxTo = (tx: Transaction): string | undefined => {
  switch (tx.txInfo.type) {
    case 'Transfer': {
      return tx.txInfo.recipient
    }
    case 'SettingsChange': {
      return undefined
    }
    case 'Custom': {
      return tx.txInfo.to
    }
    case 'Creation': {
      return tx.txInfo.factory || undefined
    }
  }
}
