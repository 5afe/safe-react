import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'

import {
  addHistoryTransactions,
  addQueuedTransactions,
} from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import { loadHistoryTransactions, loadQueuedTransactions } from './loadGatewayTransactions'
import { AppReduxState } from 'src/store'

export default (safeAddress: string) => async (
  dispatch: ThunkDispatch<AppReduxState, undefined, AnyAction>,
): Promise<void> => {
  const loadTxs = async (
    loadFn: typeof loadHistoryTransactions | typeof loadQueuedTransactions,
    actionFn: typeof addHistoryTransactions | typeof addQueuedTransactions,
  ) => {
    try {
      const values = (await loadFn(safeAddress)) as any[]
      dispatch(actionFn({ safeAddress, values }))
    } catch (e) {
      e.log()
    }
  }

  await Promise.all([
    loadTxs(loadHistoryTransactions, addHistoryTransactions),
    loadTxs(loadQueuedTransactions, addQueuedTransactions),
  ])
}
