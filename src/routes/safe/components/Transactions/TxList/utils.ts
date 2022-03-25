import {
  AddressEx,
  TransactionInfo,
  Transfer,
  TransactionTokenType,
  TransactionDetails,
  MultisigExecutionDetails,
  MultisigExecutionInfo,
  Erc721Transfer,
  SettingsChange,
  Custom,
} from '@gnosis.pm/safe-react-gateway-sdk'
import { BigNumber } from 'bignumber.js'
import { matchPath } from 'react-router-dom'
import { getNativeCurrency } from 'src/config'
import { getNativeCurrencyAddress } from 'src/config/utils'

import {
  isCustomTxInfo,
  isModuleExecutionInfo,
  isMultiSigExecutionDetails,
  isSettingsChangeTxInfo,
  isTransferTxInfo,
  isTxQueued,
  LocalTransactionStatus,
  Transaction,
} from 'src/logic/safe/store/models/types/gateway.d'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { SAFE_ROUTES, TRANSACTION_ID_SLUG, history } from 'src/routes/routes'

export const NOT_AVAILABLE = 'n/a'
interface AmountData {
  decimals?: number | string
  symbol?: string
  value: number | string
}

export type TokenTransferAsset = {
  type: 'Transfer'
  name: string
  logoUri: string
  directionSign: '+' | '-' | ''
  amountWithSymbol: string
  tokenType: string
}

export type AssetInfo = TokenTransferAsset | SettingsChange | Custom

export const isTokenTransferAsset = (value: AssetInfo): value is TokenTransferAsset => {
  return value.type === 'Transfer'
}

const defaultTokenTransferAsset: TokenTransferAsset = {
  type: 'Transfer',
  name: NOT_AVAILABLE,
  logoUri: NOT_AVAILABLE,
  directionSign: '',
  amountWithSymbol: NOT_AVAILABLE,
  tokenType: 'UNKNOWN',
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

export const getTokenIdLabel = ({ tokenId }: Erc721Transfer): string => {
  return tokenId ? `(#${tokenId})` : ''
}

export const getTxAmount = (txInfo?: TransactionInfo, formatted = true): string => {
  if (!txInfo || !isTransferTxInfo(txInfo)) {
    return NOT_AVAILABLE
  }

  switch (txInfo.transferInfo.type) {
    case TransactionTokenType.ERC20:
      return getAmountWithSymbol(
        {
          decimals: `${txInfo.transferInfo.decimals ?? 0}`,
          symbol: `${txInfo.transferInfo.tokenSymbol ?? NOT_AVAILABLE}`,
          value: txInfo.transferInfo.value,
        },
        formatted,
      )
    case TransactionTokenType.ERC721:
      // simple workaround to avoid displaying unexpected values for incoming NFT transfer
      return `1 ${txInfo.transferInfo.tokenSymbol} ${getTokenIdLabel(txInfo.transferInfo)}`
    case TransactionTokenType.NATIVE_COIN: {
      const nativeCurrency = getNativeCurrency()
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
  const nativeCurrency = getNativeCurrency()
  switch (txInfo.transferInfo.type) {
    case TransactionTokenType.ERC20:
      return {
        address: txInfo.transferInfo.tokenAddress,
        value: txInfo.transferInfo.value,
        decimals: txInfo.transferInfo.decimals,
      }
    case TransactionTokenType.ERC721:
      return { address: txInfo.transferInfo.tokenAddress, value: '1', decimals: 0 }
    default:
      return {
        address: getNativeCurrencyAddress(),
        value: txInfo.transferInfo.value,
        decimals: nativeCurrency.decimals,
      }
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

export const getTxTo = ({ txInfo }: Pick<Transaction, 'txInfo'>): AddressEx | undefined => {
  switch (txInfo.type) {
    case 'Transfer': {
      return txInfo.recipient
    }
    case 'SettingsChange': {
      return undefined
    }
    case 'Custom': {
      return txInfo.to
    }
    case 'Creation': {
      return txInfo.factory || undefined
    }
  }
}

// Our store does not match the details returned from the endpoint
export const makeTxFromDetails = (txDetails: TransactionDetails): Transaction => {
  const getMissingSigners = ({
    signers,
    confirmations,
  }: MultisigExecutionDetails): MultisigExecutionInfo['missingSigners'] => {
    const missingSigners = signers.filter(({ value }) => {
      const hasConfirmed = confirmations?.some(({ signer }) => signer?.value === value)
      return !hasConfirmed
    })

    return missingSigners.length ? missingSigners : null
  }

  const getMultisigExecutionInfo = ({
    detailedExecutionInfo,
  }: TransactionDetails): MultisigExecutionInfo | undefined => {
    if (!isMultiSigExecutionDetails(detailedExecutionInfo)) return undefined

    return {
      type: detailedExecutionInfo.type,
      nonce: detailedExecutionInfo.nonce,
      confirmationsRequired: detailedExecutionInfo.confirmationsRequired,
      confirmationsSubmitted: detailedExecutionInfo.confirmations?.length || 0,
      missingSigners: getMissingSigners(detailedExecutionInfo),
    }
  }

  const executionInfo: Transaction['executionInfo'] = isModuleExecutionInfo(txDetails.detailedExecutionInfo)
    ? txDetails.detailedExecutionInfo
    : getMultisigExecutionInfo(txDetails)

  // Will only be used as a fallback whilst waiting on backend tx creation cache
  const now = Date.now()
  const timestamp = isTxQueued(txDetails.txStatus)
    ? isMultiSigExecutionDetails(txDetails.detailedExecutionInfo)
      ? txDetails.detailedExecutionInfo.submittedAt
      : now
    : txDetails.executedAt || now

  const tx: Transaction = {
    id: txDetails.txId,
    timestamp,
    txStatus: txDetails.txStatus,
    txInfo: txDetails.txInfo,
    executionInfo,
    safeAppInfo: txDetails?.safeAppInfo || undefined,
    txDetails,
  }

  return tx
}

export const isDeeplinkedTx = (): boolean => {
  const txMatch = matchPath(history.location.pathname, {
    path: [SAFE_ROUTES.TRANSACTIONS_HISTORY, SAFE_ROUTES.TRANSACTIONS_QUEUE],
  })

  const deeplinkMatch = matchPath(history.location.pathname, {
    path: SAFE_ROUTES.TRANSACTIONS_SINGULAR,
  })

  return !txMatch && !!deeplinkMatch?.params?.[TRANSACTION_ID_SLUG]
}

export const isAwaitingExecution = (
  txStatus: typeof LocalTransactionStatus[keyof typeof LocalTransactionStatus],
): boolean => LocalTransactionStatus.AWAITING_EXECUTION === txStatus

export const getAssetInfo = (txInfo: TransactionInfo): AssetInfo | undefined => {
  const amountWithSymbol = getTxAmount(txInfo)
  if (isTransferTxInfo(txInfo)) {
    const { direction, transferInfo } = txInfo as Transfer
    const directionSign = direction === 'INCOMING' ? '+' : '-'

    switch (transferInfo.type) {
      case TransactionTokenType.ERC20: {
        return {
          type: 'Transfer',
          name: transferInfo.tokenName ?? defaultTokenTransferAsset.name,
          logoUri: transferInfo.logoUri ?? defaultTokenTransferAsset.logoUri,
          directionSign,
          amountWithSymbol,
          tokenType: transferInfo.type,
        }
      }
      case TransactionTokenType.ERC721: {
        return {
          type: 'Transfer',
          name: `${transferInfo.tokenName ?? defaultTokenTransferAsset.name} ${getTokenIdLabel(transferInfo)}`,
          logoUri: transferInfo.logoUri ?? defaultTokenTransferAsset.logoUri,
          directionSign: directionSign,
          amountWithSymbol,
          tokenType: transferInfo.type,
        }
      }
      case TransactionTokenType.NATIVE_COIN: {
        const nativeCurrency = getNativeCurrency()

        return {
          type: 'Transfer',
          name: nativeCurrency.name ?? defaultTokenTransferAsset.name,
          logoUri: nativeCurrency.logoUri ?? defaultTokenTransferAsset.logoUri,
          directionSign: directionSign,
          amountWithSymbol,
          tokenType: transferInfo.type,
        }
      }
    }
  }

  if (isSettingsChangeTxInfo(txInfo)) {
    return txInfo as SettingsChange
  }

  if (isCustomTxInfo(txInfo)) {
    return txInfo as Custom
  }
}
