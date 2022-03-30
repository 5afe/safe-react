import {
  AddressEx,
  Erc20Transfer,
  Erc721Transfer,
  MultisigExecutionDetails,
  MultisigExecutionInfo,
  Operation,
  TransactionDetails,
  TransactionInfo,
  TransactionTokenType,
  Transfer,
} from '@gnosis.pm/safe-react-gateway-sdk'
import { BigNumber } from 'bignumber.js'
import { matchPath } from 'react-router-dom'
import { getNativeCurrency } from 'src/config'
import { getNativeCurrencyAddress } from 'src/config/utils'

import {
  isCustomTxInfo,
  isModuleExecutionInfo,
  isMultiSigExecutionDetails,
  isMultisigExecutionInfo,
  isTransferTxInfo,
  isTxQueued,
  LocalTransactionStatus,
  Transaction,
} from 'src/logic/safe/store/models/types/gateway.d'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { sameAddress, ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { history, SAFE_ROUTES, TRANSACTION_ID_SLUG } from 'src/routes/routes'
import { TxArgs } from 'src/logic/safe/store/models/types/transaction'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { List } from 'immutable'
import { makeConfirmation } from 'src/logic/safe/store/models/confirmation'
import { Confirmation } from 'src/logic/safe/store/models/types/confirmation'

type TxInfoProps = Pick<
  TxArgs,
  | 'data'
  | 'baseGas'
  | 'gasPrice'
  | 'safeTxGas'
  | 'gasToken'
  | 'nonce'
  | 'refundReceiver'
  | 'valueInWei'
  | 'to'
  | 'operation'
>

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

export const getTxInfo = (transaction: Transaction, safeAddress: string): TxInfoProps => {
  if (!transaction.txDetails) return {} as TxInfoProps

  const DEFAULT_TX_INFO = {
    data: EMPTY_DATA,
    baseGas: '0',
    gasPrice: '0',
    safeTxGas: '0',
    gasToken: ZERO_ADDRESS,
    nonce: 0,
    refundReceiver: ZERO_ADDRESS,
    valueInWei: getTxValue(transaction.txInfo, transaction.txDetails),
    to: getTxRecipient(transaction.txInfo, safeAddress),
    operation: Operation.CALL,
  }

  if (!isMultiSigExecutionDetails(transaction.txDetails.detailedExecutionInfo)) {
    return DEFAULT_TX_INFO
  }

  const { baseGas, gasPrice, safeTxGas, gasToken, refundReceiver } = transaction.txDetails.detailedExecutionInfo
  const data = transaction.txDetails.txData?.hexData ?? DEFAULT_TX_INFO.data
  const nonce = isMultisigExecutionInfo(transaction.executionInfo)
    ? transaction.executionInfo.nonce
    : DEFAULT_TX_INFO.nonce
  const operation = transaction.txDetails.txData?.operation ?? DEFAULT_TX_INFO.operation

  return {
    ...DEFAULT_TX_INFO,
    data,
    baseGas,
    gasPrice,
    safeTxGas,
    gasToken,
    nonce,
    refundReceiver: refundReceiver.value,
    operation,
  }
}

export const getTxConfirmations = (transaction: Transaction): List<Confirmation> => {
  if (!transaction.txDetails) return List([])

  return transaction.txDetails.detailedExecutionInfo &&
    isMultiSigExecutionDetails(transaction.txDetails.detailedExecutionInfo)
    ? List(
        transaction.txDetails.detailedExecutionInfo.confirmations.map(({ signer, signature }) =>
          makeConfirmation({ owner: signer.value, signature }),
        ),
      )
    : List([])
}

export const getTxValue = (txInfo: TransactionInfo, txDetails: TransactionDetails): string => {
  switch (txInfo.type) {
    case 'Transfer':
      if (txInfo.transferInfo.type === TransactionTokenType.NATIVE_COIN) {
        return txInfo.transferInfo.value
      } else {
        return txDetails.txData?.value ?? '0'
      }
    case 'Custom':
      return txInfo.value
    case 'Creation':
    case 'SettingsChange':
    default:
      return '0'
  }
}

export const getTxRecipient = (txInfo: TransactionInfo, safeAddress: string): string => {
  switch (txInfo.type) {
    case 'Transfer':
      if (txInfo.transferInfo.type === TransactionTokenType.NATIVE_COIN) {
        return txInfo.recipient.value
      } else {
        return (txInfo.transferInfo as Erc20Transfer | Erc721Transfer).tokenAddress
      }
    case 'Custom':
      return txInfo.to.value
    case 'Creation':
    case 'SettingsChange':
    default:
      return safeAddress
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

  return {
    id: txDetails.txId,
    timestamp,
    txStatus: txDetails.txStatus,
    txInfo: txDetails.txInfo,
    executionInfo,
    safeAppInfo: txDetails?.safeAppInfo || undefined,
    txDetails,
  }
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
