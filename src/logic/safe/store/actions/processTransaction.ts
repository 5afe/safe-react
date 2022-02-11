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
import { RequiredTxProps, TxSender } from './createTransaction'
import { logError, Errors } from 'src/logic/exceptions/CodedException'
import { TxArgs } from '../models/types/transaction'

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

const getProcessTxProps = ({
  notifiedTransaction,
  safeAddress,
  ethParameters,
  tx,
}: ProcessTransactionArgs): RequiredTxProps => {
  const { operation, origin, to, data = EMPTY_DATA, nonce, value, safeTxGas } = tx
  return {
    navigateToTransactionsTab: false,
    notifiedTransaction: notifiedTransaction,
    operation,
    origin,
    safeAddress,
    to,
    txData: data,
    txNonce: nonce,
    valueInWei: value,
    safeTxGas: safeTxGas,
    ethParameters,
  }
}

const getProcessTxArgs = async (
  { tx, approveAndExecute, preApprovingOwner }: ProcessTransactionArgs,
  { safeInstance, from }: TxSender,
): Promise<TxArgs> => {
  const { gasPrice = '0', confirmations, value, data = EMPTY_DATA } = tx
  return {
    ...tx, // Merge previous tx with new data
    safeInstance,
    valueInWei: value,
    data,
    gasPrice,
    sender: from,
    sigs: generateSignaturesFromTxConfirmations(confirmations, approveAndExecute ? preApprovingOwner : undefined),
  }
}

const isFinalization = ({
  approveAndExecute,
  thresholdReached,
  preApprovingOwner,
}: ProcessTransactionArgs): boolean => {
  return approveAndExecute && Boolean(thresholdReached || preApprovingOwner)
}

export const processTransaction = (props: ProcessTransactionArgs): ProcessTransactionAction => {
  return async (dispatch: Dispatch, getState: () => AppReduxState): Promise<void> => {
    const sender = new TxSender()

    sender.txId = props.tx.id

    const state = getState()

    try {
      await sender.prepare(dispatch, state, getProcessTxProps(props))
    } catch (err) {
      logError(Errors._815, err.message)
      return
    }

    sender.isFinalization = isFinalization(props)
    sender.txArgs = await getProcessTxArgs(props, sender)
    sender.safeTxHash = props.tx.safeTxHash

    sender.submitTx(state)
  }
}
