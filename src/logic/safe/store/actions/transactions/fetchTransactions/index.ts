import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'

import {
  addHistoryTransactions,
  addQueuedTransactions,
} from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import { loadHistoryTransactions, loadQueuedTransactions } from './loadGatewayTransactions'
import { AppReduxState } from 'src/store'
import { Errors, logError } from 'src/logic/exceptions/CodedException'

export default (safeAddress: string) => async (
  dispatch: ThunkDispatch<AppReduxState, undefined, AnyAction>,
): Promise<void> => {
  const [history, queued] = await Promise.allSettled([
    loadHistoryTransactions(safeAddress),
    loadQueuedTransactions(safeAddress),
  ])

  if (history.status === 'fulfilled') {
    const values = history.value

    if (values.length) {
      dispatch(addHistoryTransactions({ safeAddress, values }))
    }
  } else {
    logError(Errors._602, history.reason)
  }

  if (queued.status === 'fulfilled') {
    const values = queued.value
    dispatch(addQueuedTransactions({ safeAddress, values }))
  } else {
    logError(Errors._603, queued.reason)
  }
}
