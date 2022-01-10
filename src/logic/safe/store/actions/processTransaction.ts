import { List } from 'immutable'
import { AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { generateSignaturesFromTxConfirmations, getPreValidatedSignatures } from 'src/logic/safe/safeTxSigner'
import { currentSafeCurrentVersion } from 'src/logic/safe/store/selectors'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { AppReduxState } from 'src/store'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { Dispatch, DispatchReturn } from './types'
import { Confirmation } from 'src/logic/safe/store/models/types/confirmation'
import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'
import { TxSender } from './createTransaction'

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
  userAddress: string
  ethParameters?: Pick<TxParameters, 'ethNonce' | 'ethGasLimit' | 'ethGasPriceInGWei'>
  thresholdReached: boolean
}

type ProcessTransactionAction = ThunkAction<Promise<void | string>, AppReduxState, DispatchReturn, AnyAction>

class TxProcessor extends TxSender {
  public processTransaction(props: ProcessTransactionArgs): ProcessTransactionAction {
    return async (dispatch: Dispatch, getState: () => AppReduxState): Promise<void> => {
      // Selectors
      const state = getState()

      const { tx } = props
      const txProps = {
        navigateToTransactionsTab: false,
        notifiedTransaction: props.notifiedTransaction,
        operation: tx.operation,
        origin: tx.origin,
        safeAddress: props.safeAddress,
        to: tx.to,
        txData: tx.data ?? EMPTY_DATA,
        txNonce: '',
        valueInWei: tx.value,
        safeTxGas: tx.safeTxGas,
        ethParameters: props.ethParameters,
        delayExecution: props.approveAndExecute || false,
      }

      this.prepare(dispatch, state, txProps)

      const preApprovingOwner = txProps.delayExecution && !props.thresholdReached ? props.userAddress : undefined

      this.txArgs = {
        ...tx, // Merge previous tx with new data
        safeInstance: getGnosisSafeInstanceAt(txProps.safeAddress, currentSafeCurrentVersion(state)),
        valueInWei: tx.value,
        data: txProps.txData,
        gasPrice: tx.gasPrice || '0',
        sender: this.from,
        sigs:
          generateSignaturesFromTxConfirmations(tx.confirmations, preApprovingOwner) ||
          getPreValidatedSignatures(this.from),
      }

      this.submitTx(state)
    }
  }
}

const sender = new TxProcessor()
export const processTransaction = sender.processTransaction.bind(sender)
