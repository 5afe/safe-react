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
import { GnosisSafe } from 'src/types/contracts/gnosis_safe'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { providerSelector } from 'src/logic/wallets/store/selectors'
import { currentSafeCurrentVersion } from '../selectors'
import { TxSender } from './TxSender'

export interface ProcessTransactionArgs {
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

// Assign defaults to txArgs
const getProcessTxArgs = async (
  { approveAndExecute, preApprovingOwner, tx }: ProcessTransactionArgs,
  safeInstance: GnosisSafe,
  from: string,
): Promise<TxArgs> => {
  const {
    gasPrice = '0',
    data = EMPTY_DATA,
    baseGas,
    gasToken,
    nonce,
    operation,
    refundReceiver,
    safeTxGas,
    to,
    value,
    confirmations,
  } = tx
  return {
    baseGas,
    data,
    gasPrice,
    gasToken,
    nonce,
    operation,
    refundReceiver,
    safeInstance,
    safeTxGas,
    sender: from,
    sigs: generateSignaturesFromTxConfirmations(confirmations, approveAndExecute ? preApprovingOwner : undefined),
    to,
    valueInWei: value,
  }
}

export const processTransaction = (props: ProcessTransactionArgs): ProcessTransactionAction => {
  return async (dispatch: Dispatch, getState: () => AppReduxState): Promise<void | string> => {
    const { approveAndExecute, thresholdReached, preApprovingOwner, safeAddress, tx } = props

    const state = getState()

    const provider = providerSelector(state)
    const safeVersion = currentSafeCurrentVersion(state)
    const safeInstance = getGnosisSafeInstanceAt(safeAddress, safeVersion)
    const txArgs = await getProcessTxArgs(props, safeInstance, provider.account)

    try {
      const txSender = new TxSender({
        props,
        origin,
        dispatch,
        isFinalization: approveAndExecute && Boolean(thresholdReached || preApprovingOwner),
        provider,
        safeVersion,
        txArgs,
        safeTxHash: tx.safeTxHash,
        safeInstance,
        txId: tx.id,
      })

      // Return txHash
      return txSender.submitTx()
    } catch (err) {
      logError(Errors._815, err.message)
    }
  }
}
