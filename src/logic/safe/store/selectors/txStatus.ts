import { TransactionStatus } from '@gnosis.pm/safe-react-gateway-sdk'
import { createSelector } from 'reselect'
import { ChainId } from 'src/config/chain.d'
import { currentChainId } from 'src/logic/config/store/selectors'
import { AppReduxState } from 'src/store'
import {
  isMultiSigExecutionDetails,
  LocalTransactionStatus,
  Transaction,
} from 'src/logic/safe/store/models/types/gateway.d'
import { LocalStatusesState, LOCAL_TRANSACTIONS_ID } from '../reducer/localTransactions'

export const localStatuses = (state: AppReduxState): LocalStatusesState => {
  return state[LOCAL_TRANSACTIONS_ID]
}

export const selectTxStatus = createSelector(
  localStatuses,
  currentChainId,
  (_: AppReduxState, tx: Transaction): Transaction => tx,
  (localTxStatusesState: LocalStatusesState, chainId: string, tx: Transaction): TransactionStatus => {
    const isUnknownStatus = [
      LocalTransactionStatus.AWAITING_CONFIRMATIONS,
      LocalTransactionStatus.AWAITING_EXECUTION,
    ].includes(tx.txStatus)

    if (!isUnknownStatus) {
      return tx.txStatus
    }

    const { detailedExecutionInfo } = tx.txDetails || {}
    const hash =
      detailedExecutionInfo && isMultiSigExecutionDetails(detailedExecutionInfo)
        ? detailedExecutionInfo.safeTxHash
        : null
    const statusesOnChain = localTxStatusesState[chainId as ChainId]
    const localStatus = hash && statusesOnChain ? statusesOnChain[hash] : undefined
    return localStatus || tx.txStatus
  },
)
