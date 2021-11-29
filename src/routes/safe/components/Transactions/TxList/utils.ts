import { AddressEx, TransactionInfo, Transfer, TokenType } from '@gnosis.pm/safe-react-gateway-sdk'
import { BigNumber } from 'bignumber.js'

import { getChainInfo } from 'src/config'
import { isCustomTxInfo, isTransferTxInfo, Transaction } from 'src/logic/safe/store/models/types/gateway.d'

import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { sameAddress, ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'

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
    case TokenType.ERC20:
      return getAmountWithSymbol(
        {
          decimals: `${txInfo.transferInfo.decimals ?? 0}`,
          symbol: `${txInfo.transferInfo.tokenSymbol ?? NOT_AVAILABLE}`,
          value: txInfo.transferInfo.value,
        },
        formatted,
      )
    case TokenType.ERC721:
      // simple workaround to avoid displaying unexpected values for incoming NFT transfer
      return `1 ${txInfo.transferInfo.tokenSymbol}`
    case TokenType.NATIVE_COIN: {
      const { nativeCurrency } = getChainInfo()
      return getAmountWithSymbol(
        {
          decimals: nativeCurrency.decimals,
          symbol: nativeCurrency.symbol,
          value: txInfo.transferInfo.value,
        },
        formatted,
      )
    }
    default:
      return NOT_AVAILABLE
  }
}

type txTokenData = {
  address: string
  value: string
  decimals: number | null
}

export const getTxTokenData = (txInfo: Transfer): txTokenData => {
  const { nativeCurrency } = getChainInfo()
  switch (txInfo.transferInfo.type) {
    case TokenType.ERC20:
      return {
        address: txInfo.transferInfo.tokenAddress,
        value: txInfo.transferInfo.value,
        decimals: txInfo.transferInfo.decimals,
      }
    case TokenType.ERC721:
      return { address: txInfo.transferInfo.tokenAddress, value: '1', decimals: 0 }
    default:
      // `nativeCurrency.address` config was `ZERO_ADDRESS` before migration to chains endpoint
      return { address: ZERO_ADDRESS, value: txInfo.transferInfo.value, decimals: nativeCurrency.decimals }
  }
}

export const isCancelTxDetails = (txInfo: Transaction['txInfo']): boolean =>
  // custom transaction
  isCustomTxInfo(txInfo) &&
  // flag-based identification
  txInfo.isCancellation

export const addressInList =
  (list: AddressEx[] = []) =>
  (address: string): boolean =>
    list.some((ownerAddress) => sameAddress(ownerAddress.value, address))

export const getTxTo = (tx: Transaction): AddressEx | undefined => {
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
