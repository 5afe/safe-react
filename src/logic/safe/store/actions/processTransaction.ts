import { List } from 'immutable'
import { AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'

import { generateSignaturesFromTxConfirmations } from 'src/logic/safe/safeTxSigner'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { AppReduxState } from 'src/store'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { Dispatch, DispatchReturn } from './types'
import { Confirmation } from 'src/logic/safe/store/models/types/confirmation'
import { TxSender } from './createTransaction'
import { logError, Errors } from 'src/logic/exceptions/CodedException'

interface ProcessTransactionArgs {
  approveAndExecute: boolean
  notifiedTransaction: string
  safeAddress: string
  tx: {
    id: string
    confirmations: List<Confirmation>
    origin: string // json.stringified url, name
    to: string
    value: string
    data: string
    operation: Operation
    nonce: number
    safeTxGas: string
    safeTxHash: string
    baseGas: string
    gasPrice: string
    gasToken: string
    refundReceiver: string
  }
  ethParameters?: Pick<TxParameters, 'ethNonce' | 'ethGasLimit' | 'ethGasPriceInGWei' | 'ethMaxPrioFeeInGWei'>
  preApprovingOwner?: string
  thresholdReached: boolean
}

type ProcessTransactionAction = ThunkAction<Promise<void | string>, AppReduxState, DispatchReturn, AnyAction>

export const processTransaction = (props: ProcessTransactionArgs): ProcessTransactionAction => {
  return async (dispatch: Dispatch, getState: () => AppReduxState): Promise<void> => {
    const sender = new TxSender()

    // Selectors
    const state = getState()

    const { tx, approveAndExecute } = props

    // Set specific transaction being finalised
    sender.txId = tx.id

    const txProps = {
      navigateToTransactionsTab: false,
      notifiedTransaction: props.notifiedTransaction,
      operation: tx.operation,
      origin: tx.origin,
      safeAddress: props.safeAddress,
      to: tx.to,
      txData: tx.data ?? EMPTY_DATA,
      txNonce: tx.nonce,
      valueInWei: tx.value,
      safeTxGas: tx.safeTxGas,
      ethParameters: props.ethParameters,
    }

    // Populate instance vars
    try {
      await sender.prepare(dispatch, state, txProps)
    } catch (err) {
      logError(Errors._815, err.message)
      return
    }

    sender.isFinalization = approveAndExecute && !!(props.thresholdReached || props.preApprovingOwner)

    sender.txArgs = {
      ...tx, // Merge previous tx with new data
      safeInstance: sender.safeInstance,
      valueInWei: tx.value,
      data: txProps.txData,
      gasPrice: tx.gasPrice || '0',
      sender: sender.from,
      sigs: generateSignaturesFromTxConfirmations(
        tx.confirmations,
        approveAndExecute ? props.preApprovingOwner : undefined,
      ),
    }

    sender.safeTxHash = tx.safeTxHash

    sender.submitTx()
  }
}
