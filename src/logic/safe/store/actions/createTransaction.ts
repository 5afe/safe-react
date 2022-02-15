import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'
import { AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { logError, Errors } from 'src/logic/exceptions/CodedException'
import { getPreValidatedSignatures } from 'src/logic/safe/safeTxSigner'
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
import { ConfirmEventHandler, ErrorEventHandler, TxSender } from './txSender'

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

// Assign defaults to txArgs
const getTxCreationTxArgs = async (
  {
    to,
    valueInWei,
    txData = EMPTY_DATA,
    operation = Operation.CALL,
    safeTxGas = '0',
    txNonce,
    safeAddress,
  }: CreateTransactionArgs,
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
    safeTxGas,
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
): Promise<boolean> => {
  const lastTx = getLastTransaction(state)
  return canExecuteCreatedTx(safeInstance, nonce, lastTx)
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

    try {
      const txArgs = await getTxCreationTxArgs(props, safeInstance, provider.account)
      const isExecuting = delayExecution
        ? false
        : await isImmediateExecution(safeInstance, txArgs.nonce.toString(), state)

      const txSender = new TxSender(
        {
          props,
          origin,
          dispatch,
          isExecuting,
          provider,
          safeVersion,
          txArgs,
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
