import { TransactionStatus } from '@gnosis.pm/safe-react-gateway-sdk'
import { Action, handleActions } from 'redux-actions'
import { _getChainId } from 'src/config'
import { ChainId } from 'src/config/chain.d'
import { UPDATE_TRANSACTION_STATUS } from 'src/logic/safe/store/actions/updateTransactionStatus'
import session from 'src/utils/storage/session'
import { LOCAL_TRANSACTIONS_STATUSES_KEY } from '../middleware/localTransactionsMiddleware'

export type TransactionStatusPayload = {
  safeTxHash: string
  status: TransactionStatus
}

export type LocalStatusesState = Record<ChainId, Record<string, TransactionStatus>>

export const LOCAL_TRANSACTIONS_ID = 'localTxStatuses'

export const localTransactionsReducer = handleActions<LocalStatusesState, TransactionStatusPayload>(
  {
    [UPDATE_TRANSACTION_STATUS]: (state, action: Action<TransactionStatusPayload>) => {
      const { safeTxHash, status } = action.payload
      const chainId = _getChainId()
      return {
        ...state,
        [chainId]: {
          ...state[chainId],
          [safeTxHash]: status,
        },
      }
    },
  },
  session.getItem(LOCAL_TRANSACTIONS_STATUSES_KEY) || {},
)

export default localTransactionsReducer
