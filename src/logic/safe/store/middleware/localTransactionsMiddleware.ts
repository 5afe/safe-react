import { Action } from 'redux'

import { Dispatch } from 'src/logic/safe/store/actions/types'
import { store as reduxStore } from 'src/store'
import session from 'src/utils/storage/session'
import { UPDATE_TRANSACTION_STATUS } from '../actions/updateTransactionStatus'
import { localStatuses } from '../selectors/txStatus'

// Save 'local statuses' to sessionStorage
export const LOCAL_TRANSACTIONS_STATUSES_KEY = 'localTxStatuses'
export const localTransactionsMiddleware =
  ({ getState }: typeof reduxStore) =>
  (next: Dispatch) =>
  async (action: Action<typeof UPDATE_TRANSACTION_STATUS>): Promise<Action<'UPDATE_TRANSACTION_STATUS'>> => {
    const handledAction = next(action)

    switch (action.type) {
      case UPDATE_TRANSACTION_STATUS: {
        const state = getState()
        const localTxStatuses = localStatuses(state)
        session.setItem(LOCAL_TRANSACTIONS_STATUSES_KEY, localTxStatuses)
        break
      }
      default:
        break
    }

    return handledAction
  }
