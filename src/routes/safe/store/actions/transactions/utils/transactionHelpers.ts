import { List, Map } from 'immutable'

import { DecodedMethods, decodeMethods } from 'src/logic/contracts/methodIds'
import { TOKEN_REDUCER_ID } from 'src/logic/tokens/store/reducer/tokens'
import {
  getERC20DecimalsAndSymbol,
  isSendERC20Transaction,
  isSendERC721Transaction,
} from 'src/logic/tokens/utils/tokenHelpers'
import { sameAddress, ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { makeConfirmation } from 'src/routes/safe/store/models/confirmation'
import { Confirmation } from 'src/routes/safe/store/models/types/confirmation'
import { makeTransaction } from 'src/routes/safe/store/models/transaction'
import {
  Transaction,
  TransactionStatus,
  TransactionStatusValues,
  TransactionTypes,
  TransactionTypeValues,
} from 'src/routes/safe/store/models/types/transaction'
import { CANCELLATION_TRANSACTIONS_REDUCER_ID } from 'src/routes/safe/store/reducer/cancellationTransactions'
import { SAFE_REDUCER_ID } from 'src/routes/safe/store/reducer/safe'
import { TRANSACTIONS_REDUCER_ID } from 'src/routes/safe/store/reducer/transactions'
import { store } from 'src/store'
import { safeSelector, safeTransactionsSelector } from 'src/routes/safe/store/selectors'
import { addOrUpdateTransactions } from 'src/routes/safe/store/actions/transactions/addOrUpdateTransactions'
import { TxServiceModel } from 'src/routes/safe/store/actions/transactions/fetchTransactions/loadOutgoingTransactions'

export const isEmptyData = (data?: string | null): boolean => {
  return !data || data === EMPTY_DATA
}

export const isInnerTransaction = (tx: TxServiceModel, safeAddress: string): boolean => {
  return sameAddress(tx.to, safeAddress) && Number(tx.value) === 0
}

export const isCancelTransaction = (tx: TxServiceModel, safeAddress: string): boolean => {
  return isInnerTransaction(tx, safeAddress) && isEmptyData(tx.data)
}

export const isPendingTransaction = (tx: Transaction, cancelTx: Transaction): boolean => {
  return (!!cancelTx && cancelTx.status === 'pending') || tx.status === 'pending'
}

export const isModifySettingsTransaction = (tx: TxServiceModel, safeAddress: string): boolean => {
  return isInnerTransaction(tx, safeAddress) && !isEmptyData(tx.data)
}

export const isMultiSendTransaction = (tx: TxServiceModel): boolean => {
  return !isEmptyData(tx.data) && tx.data.substring(0, 10) === '0x8d80ff0a' && Number(tx.value) === 0
}

export const isUpgradeTransaction = (tx: TxServiceModel): boolean => {
  return (
    !isEmptyData(tx.data) &&
    isMultiSendTransaction(tx) &&
    tx.data.substr(308, 8) === '7de7edef' && // 7de7edef - changeMasterCopy (308, 8)
    tx.data.substr(550, 8) === 'f08a0323' // f08a0323 - setFallbackHandler (550, 8)
  )
}

export const isOutgoingTransaction = (tx: TxServiceModel, safeAddress: string): boolean => {
  return !sameAddress(tx.to, safeAddress) && !isEmptyData(tx.data)
}

export const isCustomTransaction = async (
  tx: TxServiceModel,
  txCode: string,
  safeAddress: string,
  knownTokens: any,
): Promise<boolean> => {
  return (
    isOutgoingTransaction(tx, safeAddress) &&
    !(await isSendERC20Transaction(tx, txCode, knownTokens)) &&
    !isUpgradeTransaction(tx) &&
    !isSendERC721Transaction(tx, txCode, knownTokens)
  )
}

export const getRefundParams = async (
  tx: any,
  tokenInfo: (string) => Promise<{ decimals: number; symbol: string } | null>,
): Promise<any> => {
  let refundParams = null

  if (tx.gasPrice > 0) {
    let refundSymbol = 'ETH'
    let refundDecimals = 18

    if (tx.gasToken !== ZERO_ADDRESS) {
      const gasToken = await tokenInfo(tx.gasToken)

      if (gasToken !== null) {
        refundSymbol = gasToken.symbol
        refundDecimals = gasToken.decimals
      }
    }

    const feeString = (tx.gasPrice * (tx.baseGas + tx.safeTxGas)).toString().padStart(refundDecimals, '0')
    const whole = feeString.slice(0, feeString.length - refundDecimals) || '0'
    const fraction = feeString.slice(feeString.length - refundDecimals)

    refundParams = {
      fee: `${whole}.${fraction}`,
      symbol: refundSymbol,
    }
  }

  return refundParams
}

export const getDecodedParams = (tx: TxServiceModel): DecodedMethods => {
  if (tx.dataDecoded) {
    return Object.keys(tx.dataDecoded).reduce((acc, key) => {
      acc[key] = {
        ...tx.dataDecoded[key].reduce(
          (acc, param) => ({
            ...acc,
            [param.name]: param.value,
          }),
          {},
        ),
      }
      return acc
    }, {})
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
  cancellationTxs: { number: TxServiceModel },
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
  { owners, threshold }: any,
  currentUser?: string | null,
): TransactionStatusValues => {
  let txStatus

  if (tx.isExecuted && tx.isSuccessful) {
    txStatus = TransactionStatus.SUCCESS
  } else if (tx.cancelled) {
    txStatus = TransactionStatus.CANCELLED
  } else if (tx.confirmations.size === threshold) {
    txStatus = TransactionStatus.AWAITING_EXECUTION
  } else if (tx.creationTx) {
    txStatus = TransactionStatus.SUCCESS
  } else if (!tx.confirmations.size || !!tx.isPending) {
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

export const buildTx = async ({
  cancellationTxs,
  currentUser,
  knownTokens,
  outgoingTxs,
  safe,
  tx,
  txCode,
}): Promise<Transaction> => {
  const safeAddress = safe.address
  const isModifySettingsTx = isModifySettingsTransaction(tx, safeAddress)
  const isTxCancelled = isTransactionCancelled(tx, outgoingTxs, cancellationTxs)
  const isSendERC721Tx = isSendERC721Transaction(tx, txCode, knownTokens)
  const isSendERC20Tx = await isSendERC20Transaction(tx, txCode, knownTokens)
  const isMultiSendTx = isMultiSendTransaction(tx)
  const isUpgradeTx = isUpgradeTransaction(tx)
  const isCustomTx = await isCustomTransaction(tx, txCode, safeAddress, knownTokens)
  const isCancellationTx = isCancelTransaction(tx, safeAddress)
  const refundParams = await getRefundParams(tx, getERC20DecimalsAndSymbol)
  const decodedParams = getDecodedParams(tx)
  const confirmations = getConfirmations(tx)
  const { decimals = null, symbol = null } = isSendERC20Tx ? await getERC20DecimalsAndSymbol(tx.to) : {}

  const txToStore: Transaction = makeTransaction({
    baseGas: tx.baseGas,
    blockNumber: tx.blockNumber,
    cancelled: isTxCancelled,
    confirmations,
    creationTx: tx.creationTx,
    customTx: isCustomTx,
    data: tx.data ? tx.data : EMPTY_DATA,
    decimals,
    decodedParams,
    executionDate: tx.executionDate,
    executionTxHash: tx.transactionHash,
    executor: tx.executor,
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
    symbol,
    upgradeTx: isUpgradeTx,
    value: tx.value.toString(),
  })

  return txToStore
    .set('status', calculateTransactionStatus(txToStore, safe, currentUser))
    .set('type', calculateTransactionType(txToStore))
}

export const mockTransaction = (tx, safeAddress: string, state): Promise<any> => {
  const submissionDate = new Date().toISOString()

  const transactionStructure: TxServiceModel = {
    blockNumber: null,
    confirmationsRequired: null,
    dataDecoded: decodeMethods(tx.data),
    ethGasPrice: null,
    executionDate: null,
    executor: null,
    fee: null,
    gasUsed: null,
    isExecuted: false,
    isSuccessful: null,
    modified: submissionDate,
    origin: null,
    safe: safeAddress,
    safeTxHash: null,
    signatures: null,
    submissionDate,
    transactionHash: null,
    confirmations: [],
    ...tx,
  }

  const knownTokens = state[TOKEN_REDUCER_ID]
  const safe = state[SAFE_REDUCER_ID].getIn([SAFE_REDUCER_ID, safeAddress])
  const cancellationTxs = state[CANCELLATION_TRANSACTIONS_REDUCER_ID].get(safeAddress) || Map()
  const outgoingTxs = state[TRANSACTIONS_REDUCER_ID].get(safeAddress) || List()

  return buildTx({
    cancellationTxs,
    currentUser: null,
    knownTokens,
    outgoingTxs,
    safe,
    tx: transactionStructure,
    txCode: EMPTY_DATA,
  })
}

export const updateStoredTransactionsStatus = (dispatch, walletRecord): void => {
  const state = store.getState()
  const safe = safeSelector(state)

  if (safe) {
    const safeAddress = safe.address
    const transactions = safeTransactionsSelector(state)
    dispatch(
      addOrUpdateTransactions({
        safeAddress,
        transactions: transactions.withMutations((list) =>
          list.map((tx) => tx.set('status', calculateTransactionStatus(tx, safe, walletRecord.account))),
        ),
      }),
    )
  }
}
