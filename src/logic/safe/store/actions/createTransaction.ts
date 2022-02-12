import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'
import { AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { logError, Errors } from 'src/logic/exceptions/CodedException'
import { getPreValidatedSignatures } from 'src/logic/safe/safeTxSigner'
import { SafeTxGasEstimationProps, estimateSafeTxGas } from 'src/logic/safe/transactions/gas'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { AppReduxState } from 'src/store'
import { TxArgs } from 'src/logic/safe/store/models/types/transaction'
import { getLastTransaction } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { Dispatch, DispatchReturn } from 'src/logic/safe/store/actions/types'
import { canExecuteCreatedTx } from 'src/logic/safe/store/actions/utils'
import { generateSafeTxHash } from 'src/logic/safe/store/actions/transactions/utils/transactionHelpers'
import { RequiredTxProps, TxSender, getTxSender } from './txSender'

export interface CreateTransactionArgs {
  navigateToTransactionsTab?: boolean
  notifiedTransaction: string
  operation?: number
  origin?: string | null
  safeAddress: string
  to: string
  txData?: string
  txNonce?: number | string
  valueInWei: string
  safeTxGas?: string
  ethParameters?: Pick<TxParameters, 'ethNonce' | 'ethGasLimit' | 'ethGasPriceInGWei' | 'ethMaxPrioFeeInGWei'>
  delayExecution?: boolean
}

export type CreateTransactionAction = ThunkAction<Promise<void | string>, AppReduxState, DispatchReturn, AnyAction>
export type ConfirmEventHandler = (safeTxHash: string) => void
export type ErrorEventHandler = () => void

const getCreationTxProps = ({
  txData = EMPTY_DATA,
  operation = Operation.CALL,
  navigateToTransactionsTab = true,
  origin = null,
  ...rest
}: CreateTransactionArgs): RequiredTxProps => {
  return { txData, operation, navigateToTransactionsTab, origin, ...rest }
}

const getSafeTxGas = async (
  { safeAddress, txData, to, valueInWei, operation }: RequiredTxProps,
  safeVersion: string,
): Promise<string> => {
  const estimationProps: SafeTxGasEstimationProps = {
    safeAddress,
    txData,
    txRecipient: to,
    txAmount: valueInWei,
    operation,
  }

  let safeTxGas = '0'
  try {
    safeTxGas = await estimateSafeTxGas(estimationProps, safeVersion)
  } catch (err) {
    logError(Errors._617, err.message)
  }
  return safeTxGas
}

const getCreationTxArgs = async (
  txProps: RequiredTxProps,
  { safeInstance, nonce, safeVersion, from }: Omit<TxSender, 'submitTx'>,
): Promise<TxArgs> => {
  const { to, valueInWei, txData, operation, safeTxGas } = txProps
  return {
    safeInstance,
    to,
    valueInWei,
    data: txData,
    operation,
    nonce: Number.parseInt(nonce),
    safeTxGas: safeTxGas ?? (await getSafeTxGas(txProps, safeVersion)),
    baseGas: '0',
    gasPrice: '0',
    gasToken: ZERO_ADDRESS,
    refundReceiver: ZERO_ADDRESS,
    sender: from,
    // We're making a new tx, so there are no other signatures
    // Just pass our own address for an unsigned execution
    // Contract will compare the sender address to this
    sigs: getPreValidatedSignatures(from),
  }
}

const isImmediateExecution = async (
  { delayExecution }: CreateTransactionArgs,
  { safeInstance, nonce }: Omit<TxSender, 'submitTx'>,
  state: AppReduxState,
): Promise<boolean> => {
  if (delayExecution) {
    return false
  }
  const lastTx = getLastTransaction(state)
  return await canExecuteCreatedTx(safeInstance, nonce, lastTx)
}

export const createTransaction = (
  props: CreateTransactionArgs,
  confirmCallback?: ConfirmEventHandler,
  errorCallback?: ErrorEventHandler,
): CreateTransactionAction => {
  return async (dispatch: Dispatch, getState: () => AppReduxState): Promise<void> => {
    const state = getState()
    const txProps = getCreationTxProps(props)

    try {
      const { submitTx, ...sender } = await getTxSender(dispatch, state, txProps)

      const txArgs = await getCreationTxArgs(txProps, sender)

      const submissionDetails = {
        txArgs,
        isFinalization: await isImmediateExecution(props, sender, state),
        safeTxHash: generateSafeTxHash(txProps.safeAddress, sender.safeVersion, txArgs),
      }

      submitTx(submissionDetails, confirmCallback, errorCallback)
    } catch (err) {
      logError(Errors._815, err.message)
    }
  }
}
