import { List } from 'immutable'
import { AnyAction, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'

import { generateSignaturesFromTxConfirmations } from 'src/logic/safe/safeTxSigner'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { AppReduxState } from 'src/store'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { Confirmation } from 'src/logic/safe/store/models/types/confirmation'
import { logError, Errors } from 'src/logic/exceptions/CodedException'
import { TxArgs } from 'src/logic/safe/store/models/types/transaction'
import { DispatchReturn } from 'src/logic/safe/store/actions/types'
import { RequiredTxProps, TxSender, getTxSender } from './txSender'

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
    notifiedTransaction,
    operation,
    origin,
    safeAddress,
    to,
    txData: data,
    txNonce: nonce,
    valueInWei: value,
    safeTxGas,
    ethParameters,
  }
}

const getProcessTxArgs = async (
  { tx, approveAndExecute, preApprovingOwner }: ProcessTransactionArgs,
  { safeInstance, from }: Omit<TxSender, 'submitTx'>,
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
    const state = getState()
    const txProps = getProcessTxProps(props)

    try {
      const { submitTx, ...sender } = await getTxSender(dispatch, state, txProps, props.tx.id)

      submitTx({
        txArgs: await getProcessTxArgs(props, sender),
        isFinalization: isFinalization(props),
        safeTxHash: props.tx.safeTxHash,
      })
    } catch (err) {
      logError(Errors._815, err.message)
    }
  }
}
