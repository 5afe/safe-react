import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'

import {
  addHistoryTransactions,
  addQueuedTransactions,
} from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import { loadHistoryTip, loadQueuedTransactions } from './loadGatewayTransactions'
import { AppReduxState } from 'src/store'

export default (chainId: string, safeAddress: string) =>
  async (dispatch: ThunkDispatch<AppReduxState, undefined, AnyAction>): Promise<void> => {
    const loadHistory = async () => {
      try {
        const values = await loadHistoryTip(safeAddress)
        dispatch(addHistoryTransactions({ chainId, safeAddress, values }))
      } catch (e) {
        e.log()
      }
    }

    const loadQueue = async () => {
      try {
        const values = await loadQueuedTransactions(safeAddress)
        dispatch(addQueuedTransactions({ chainId, safeAddress, values }))
      } catch (e) {
        e.log()
      }
    }

    await Promise.all([loadHistory(), loadQueue()])
  }
