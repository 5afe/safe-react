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
import { canExecuteCreatedTx, getNonce } from 'src/logic/safe/store/actions/utils'
import { generateSafeTxHash } from 'src/logic/safe/store/actions/transactions/utils/transactionHelpers'
import { GnosisSafe } from 'src/types/contracts/gnosis_safe'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { providerSelector } from 'src/logic/wallets/store/selectors'
import { currentSafeCurrentVersion } from '../selectors'
import { ConfirmEventHandler, ErrorEventHandler, TxSender } from './TxSender'

export interface CreateTransactionArgs {
  navigateToDeeplink?: boolean
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

type CreateTransactionAction = ThunkAction<Promise<void | string>, AppReduxState, DispatchReturn, AnyAction>

const getSafeTxGas = async (
  safeAddress: string,
  safeVersion: string,
  txData: string,
  to: string,
  valueInWei: string,
  operation: Operation,
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

// Assign defaults to txArgs
const getTxCreationTxArgs = async (
  {
    to,
    valueInWei,
    txData = EMPTY_DATA,
    operation = Operation.CALL,
    safeTxGas,
    txNonce,
    safeAddress,
  }: CreateTransactionArgs,
  safeVersion: string,
  safeInstance: GnosisSafe,
  from: string,
): Promise<TxArgs> => {
  return {
    baseGas: '0',
    data: txData,
    gasPrice: '0',
    gasToken: ZERO_ADDRESS,
    nonce: parseInt(txNonce?.toString() || (await getNonce(safeAddress, safeInstance)), 10),
    operation,
    refundReceiver: ZERO_ADDRESS,
    safeInstance,
    safeTxGas: safeTxGas ?? (await getSafeTxGas(safeAddress, safeVersion, txData, to, valueInWei, operation)),
    sender: from,
    sigs: getPreValidatedSignatures(from),
    to,
    valueInWei,
  }
}

const isImmediateExecution = async (
  safeInstance: GnosisSafe,
  nonce: string,
  state: AppReduxState,
  delayExecution: CreateTransactionArgs['delayExecution'],
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
  return async (dispatch: Dispatch, getState: () => AppReduxState): Promise<void | string> => {
    const { origin = null, navigateToDeeplink = true, safeAddress, delayExecution } = props

    const state = getState()

    const provider = providerSelector(state)
    const safeVersion = currentSafeCurrentVersion(state)
    const safeInstance = getGnosisSafeInstanceAt(safeAddress, safeVersion)
    const txArgs = await getTxCreationTxArgs(props, safeVersion, safeInstance, provider.account)

    try {
      const txSender = new TxSender(
        {
          props,
          origin,
          dispatch,
          isFinalization: await isImmediateExecution(safeInstance, txArgs.nonce.toString(), state, delayExecution),
          provider,
          safeVersion,
          txArgs: await getTxCreationTxArgs(props, safeVersion, safeInstance, provider.account),
          safeTxHash: generateSafeTxHash(safeAddress, safeVersion, txArgs),
          safeInstance,
          navigateToDeeplink,
        },
        confirmCallback,
        errorCallback,
      )

      // Return txHash
      return txSender.submitTx()
    } catch (err) {
      logError(Errors._815, err.message)
    }
  }
}
