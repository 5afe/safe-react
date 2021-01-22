import { List } from 'immutable'
import { getNetworkInfo } from 'src/config'
import { getERC20DecimalsAndSymbol, isSendERC20Transaction } from 'src/logic/tokens/utils/tokenHelpers'
import { getERC721Symbol, isSendERC721Transaction } from 'src/logic/collectibles/utils'
import { isEmptyAddress, sameAddress, ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { makeConfirmation } from 'src/logic/safe/store/models/confirmation'
import { Confirmation } from 'src/logic/safe/store/models/types/confirmation'
import { makeTransaction } from 'src/logic/safe/store/models/transaction'
import {
  Transaction,
  TransactionStatus,
  TransactionStatusValues,
  TransactionTypes,
  TransactionTypeValues,
  TxArgs,
  RefundParams,
} from 'src/logic/safe/store/models/types/transaction'
import { AppReduxState, store } from 'src/store'
import {
  safeSelector,
  safeTransactionsSelector,
  safeCancellationTransactionsSelector,
} from 'src/logic/safe/store/selectors'
import { addOrUpdateTransactions } from 'src/logic/safe/store/actions/transactions/addOrUpdateTransactions'
import {
  BatchProcessTxsProps,
  TxServiceModel,
} from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadOutgoingTransactions'
import { TypedDataUtils } from 'eth-sig-util'
import { ProviderRecord } from 'src/logic/wallets/store/model/provider'
import { SafeRecord } from 'src/logic/safe/store/models/safe'
import { DataDecoded, DecodedParams } from 'src/routes/safe/store/models/types/transactions.d'
import { CALL } from 'src/logic/safe/transactions'

export const isEmptyData = (data?: string | null): boolean => {
  return !data || data === EMPTY_DATA
}

export const isInnerTransaction = (tx: TxServiceModel | Transaction, safeAddress: string): boolean => {
  let isSameAddress = false

  if ((tx as TxServiceModel).to !== undefined) {
    isSameAddress = sameAddress((tx as TxServiceModel).to, safeAddress)
  } else if ((tx as Transaction).recipient !== undefined) {
    isSameAddress = sameAddress((tx as Transaction).recipient, safeAddress)
  }

  return isSameAddress && Number(tx.value) === 0
}

export const isCancelTransaction = (tx: TxServiceModel, safeAddress: string): boolean => {
  if (!sameAddress(tx.to, safeAddress)) {
    return false
  }

  if (Number(tx.value)) {
    return false
  }

  if (tx.data && !isEmptyData(tx.data)) {
    return false
  }

  if (tx.operation !== CALL) {
    return false
  }

  if (tx.baseGas) {
    return false
  }

  if (Number(tx.gasPrice)) {
    return false
  }

  if (tx.gasToken && !isEmptyAddress(tx.gasToken)) {
    return false
  }

  if (tx.refundReceiver && !isEmptyAddress(tx.refundReceiver)) {
    return false
  }

  return true
}

export const isPendingTransaction = (tx: Transaction, cancelTx: Transaction): boolean => {
  return (!!cancelTx && cancelTx.status === 'pending') || tx.status === 'pending'
}

export const isModifySettingsTransaction = (tx: TxServiceModel, safeAddress: string): boolean => {
  return isInnerTransaction(tx, safeAddress) && !isEmptyData(tx.data)
}

export const isMultiSendTransaction = (tx: TxServiceModel): boolean => {
  return !isEmptyData(tx.data) && tx.data?.substring(0, 10) === '0x8d80ff0a' && Number(tx.value) === 0
}

export const isUpgradeTransaction = (tx: TxServiceModel): boolean => {
  return (
    !isEmptyData(tx.data) &&
    isMultiSendTransaction(tx) &&
    tx.data?.substr(308, 8) === '7de7edef' && // 7de7edef - changeMasterCopy (308, 8)
    tx.data?.substr(550, 8) === 'f08a0323' // f08a0323 - setFallbackHandler (550, 8)
  )
}

export const isOutgoingTransaction = (tx: TxServiceModel, safeAddress: string): boolean => {
  return !sameAddress(tx.to, safeAddress) && !isEmptyData(tx.data)
}

export const isCustomTransaction = async (tx: TxServiceModel, safeAddress: string): Promise<boolean> => {
  const isOutgoing = isOutgoingTransaction(tx, safeAddress)
  const isErc20 = await isSendERC20Transaction(tx)
  const isUpgrade = isUpgradeTransaction(tx)
  const isErc721 = isSendERC721Transaction(tx)

  return isOutgoing && !isErc20 && !isUpgrade && !isErc721
}

export const getRefundParams = async (
  tx: TxServiceModel,
  tokenInfo: (string) => Promise<{ decimals: number; symbol: string } | null>,
): Promise<RefundParams | null> => {
  const { nativeCoin } = getNetworkInfo()
  const txGasPrice = Number(tx.gasPrice)
  let refundParams: RefundParams | null = null

  if (txGasPrice > 0) {
    let refundSymbol = nativeCoin.symbol
    let refundDecimals = nativeCoin.decimals

    if (tx.gasToken !== ZERO_ADDRESS) {
      const gasToken = await tokenInfo(tx.gasToken)

      if (gasToken !== null) {
        refundSymbol = gasToken.symbol
        refundDecimals = gasToken.decimals
      }
    }

    const feeString = (txGasPrice * (Number(tx.baseGas) + Number(tx.safeTxGas)))
      .toString()
      .padStart(refundDecimals, '0')
    const whole = feeString.slice(0, feeString.length - refundDecimals) || '0'
    const fraction = feeString.slice(feeString.length - refundDecimals)

    refundParams = {
      fee: `${whole}.${fraction}`,
      symbol: refundSymbol,
    }
  }

  return refundParams
}

export const getDecodedParams = (tx: TxServiceModel): DecodedParams | null => {
  if (tx.dataDecoded) {
    return {
      [tx.dataDecoded.method]: tx.dataDecoded.parameters.reduce(
        (acc, param) => ({
          ...acc,
          [param.name]: param.value,
        }),
        {},
      ),
    }
  }
  return null
}

export const getConfirmations = (tx: TxServiceModel): List<Confirmation> => {
  return List(
    tx.confirmations.map((conf) =>
      makeConfirmation({
        owner: conf.owner,
        hash: conf.transactionHash,
        signature: conf.signature,
      }),
    ),
  )
}

export const isTransactionCancelled = (
  tx: TxServiceModel,
  outgoingTxs: Array<TxServiceModel>,
  cancellationTxs: Record<string, TxServiceModel>,
): boolean => {
  return (
    // not executed
    !tx.isExecuted &&
    // there's an executed cancel tx, with same nonce
    ((tx.nonce && !!cancellationTxs[tx.nonce] && cancellationTxs[tx.nonce].isExecuted) ||
      // there's an executed tx, with same nonce
      outgoingTxs.some((outgoingTx) => tx.nonce === outgoingTx.nonce && outgoingTx.isExecuted))
  )
}

export const calculateTransactionStatus = (
  tx: Transaction,
  { owners, threshold, nonce }: SafeRecord,
  currentUser?: string | null,
): TransactionStatusValues => {
  let txStatus

  if (tx.isExecuted && tx.isSuccessful) {
    txStatus = TransactionStatus.SUCCESS
  } else if (tx.creationTx) {
    txStatus = TransactionStatus.SUCCESS
  } else if (tx.cancelled || nonce > tx.nonce) {
    txStatus = TransactionStatus.CANCELLED
  } else if (tx.confirmations.size === threshold) {
    txStatus = TransactionStatus.AWAITING_EXECUTION
  } else if (!!tx.isPending) {
    txStatus = TransactionStatus.PENDING
  } else {
    const userConfirmed = tx.confirmations.filter((conf) => conf.owner === currentUser).size === 1
    const userIsSafeOwner = owners.filter((owner) => owner.address === currentUser).size === 1
    txStatus =
      !userConfirmed && userIsSafeOwner
        ? TransactionStatus.AWAITING_YOUR_CONFIRMATION
        : TransactionStatus.AWAITING_CONFIRMATIONS
  }

  if (tx.isSuccessful === false) {
    txStatus = TransactionStatus.FAILED
  }

  return txStatus
}

export const calculateTransactionType = (tx: Transaction): TransactionTypeValues => {
  let txType = TransactionTypes.OUTGOING

  if (tx.isTokenTransfer) {
    txType = TransactionTypes.TOKEN
  } else if (tx.isCollectibleTransfer) {
    txType = TransactionTypes.COLLECTIBLE
  } else if (tx.modifySettingsTx) {
    txType = TransactionTypes.SETTINGS
  } else if (tx.isCancellationTx) {
    txType = TransactionTypes.CANCELLATION
  } else if (tx.customTx) {
    txType = TransactionTypes.CUSTOM
  } else if (tx.creationTx) {
    txType = TransactionTypes.CREATION
  } else if (tx.upgradeTx) {
    txType = TransactionTypes.UPGRADE
  }

  return txType
}

export type BuildTx = BatchProcessTxsProps & {
  tx: TxServiceModel
}

export const buildTx = async ({
  cancellationTxs,
  currentUser,
  outgoingTxs,
  safe,
  tx,
}: BuildTx): Promise<Transaction> => {
  const safeAddress = safe.address
  const { nativeCoin } = getNetworkInfo()
  const isModifySettingsTx = isModifySettingsTransaction(tx, safeAddress)
  const isTxCancelled = isTransactionCancelled(tx, outgoingTxs, cancellationTxs)
  const isSendERC721Tx = isSendERC721Transaction(tx)
  const isSendERC20Tx = await isSendERC20Transaction(tx)
  const isMultiSendTx = isMultiSendTransaction(tx)
  const isUpgradeTx = isUpgradeTransaction(tx)
  const isCustomTx = await isCustomTransaction(tx, safeAddress)
  const isCancellationTx = isCancelTransaction(tx, safeAddress)
  const refundParams = await getRefundParams(tx, getERC20DecimalsAndSymbol)
  const decodedParams = getDecodedParams(tx)
  const confirmations = getConfirmations(tx)

  let tokenDecimals = nativeCoin.decimals
  let tokenSymbol = nativeCoin.symbol
  try {
    if (isSendERC20Tx) {
      const { decimals, symbol } = await getERC20DecimalsAndSymbol(tx.to)
      tokenDecimals = decimals
      tokenSymbol = symbol
    } else if (isSendERC721Tx) {
      tokenSymbol = await getERC721Symbol(tx.to)
    }
  } catch (err) {
    console.log(`Failed to retrieve token data from ${tx.to}`)
  }

  const txToStore = makeTransaction({
    baseGas: tx.baseGas,
    blockNumber: tx.blockNumber,
    cancelled: isTxCancelled,
    confirmations,
    customTx: isCustomTx,
    data: tx.data ? tx.data : EMPTY_DATA,
    dataDecoded: tx.dataDecoded,
    decimals: tokenDecimals,
    decodedParams,
    executionDate: tx.executionDate,
    executionTxHash: tx.transactionHash,
    executor: tx.executor,
    fee: tx.fee,
    gasPrice: tx.gasPrice,
    gasToken: tx.gasToken || ZERO_ADDRESS,
    isCancellationTx,
    isCollectibleTransfer: isSendERC721Tx,
    isExecuted: tx.isExecuted,
    isSuccessful: tx.isSuccessful,
    isTokenTransfer: isSendERC20Tx,
    modifySettingsTx: isModifySettingsTx,
    multiSendTx: isMultiSendTx,
    nonce: tx.nonce,
    operation: tx.operation,
    origin: tx.origin,
    recipient: tx.to,
    refundParams,
    refundReceiver: tx.refundReceiver || ZERO_ADDRESS,
    safeTxGas: tx.safeTxGas,
    safeTxHash: tx.safeTxHash,
    submissionDate: tx.submissionDate,
    symbol: tokenSymbol,
    upgradeTx: isUpgradeTx,
    value: tx.value.toString(),
  })

  return txToStore
    .set('status', calculateTransactionStatus(txToStore, safe, currentUser))
    .set('type', calculateTransactionType(txToStore))
}

export type TxToMock = TxArgs & {
  confirmations: []
  safeTxHash: string
  value: string
  submissionDate: string
  dataDecoded: DataDecoded | null
}

export const mockTransaction = (tx: TxToMock, safeAddress: string, state: AppReduxState): Promise<Transaction> => {
  const safe = safeSelector(state)
  const cancellationTxs = safeCancellationTransactionsSelector(state)
  const outgoingTxs = safeTransactionsSelector(state)

  if (!safe) {
    throw new Error('Failed to recover Safe from the store')
  }

  return buildTx({
    cancellationTxs,
    currentUser: undefined,
    outgoingTxs,
    safe,
    tx: (tx as unknown) as TxServiceModel,
  })
}

export const updateStoredTransactionsStatus = (dispatch: (any) => void, walletRecord: ProviderRecord): void => {
  const state = store.getState()
  const safe = safeSelector(state)

  if (safe) {
    const safeAddress = safe.address
    const transactions = safeTransactionsSelector(state)
    dispatch(
      addOrUpdateTransactions({
        safeAddress,
        transactions: transactions.withMutations((list: any[]) =>
          list.map((tx) => tx.set('status', calculateTransactionStatus(tx, safe, walletRecord.account))),
        ),
      }),
    )
  }
}

export function generateSafeTxHash(safeAddress: string, txArgs: TxArgs): string {
  const messageTypes = {
    EIP712Domain: [{ type: 'address', name: 'verifyingContract' }],
    SafeTx: [
      { type: 'address', name: 'to' },
      { type: 'uint256', name: 'value' },
      { type: 'bytes', name: 'data' },
      { type: 'uint8', name: 'operation' },
      { type: 'uint256', name: 'safeTxGas' },
      { type: 'uint256', name: 'baseGas' },
      { type: 'uint256', name: 'gasPrice' },
      { type: 'address', name: 'gasToken' },
      { type: 'address', name: 'refundReceiver' },
      { type: 'uint256', name: 'nonce' },
    ],
  }

  const primaryType: 'SafeTx' = 'SafeTx' as const

  const typedData = {
    types: messageTypes,
    domain: {
      verifyingContract: safeAddress,
    },
    primaryType,
    message: {
      to: txArgs.to,
      value: txArgs.valueInWei,
      data: txArgs.data,
      operation: txArgs.operation,
      safeTxGas: txArgs.safeTxGas,
      baseGas: txArgs.baseGas,
      gasPrice: txArgs.gasPrice,
      gasToken: txArgs.gasToken,
      refundReceiver: txArgs.refundReceiver,
      nonce: txArgs.nonce,
    },
  }

  return `0x${TypedDataUtils.sign<typeof messageTypes>(typedData).toString('hex')}`
}
