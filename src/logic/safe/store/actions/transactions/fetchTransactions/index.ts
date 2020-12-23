import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { backOff } from 'exponential-backoff'

import { addIncomingTransactions } from 'src/logic/safe/store/actions/addIncomingTransactions'
import { addModuleTransactions } from 'src/logic/safe/store/actions/addModuleTransactions'
import {
  addHistoryTransactions,
  addQueuedTransactions,
} from 'src/logic/safe/store/actions/transactions/gatewayTransactions'

import { loadIncomingTransactions } from './loadIncomingTransactions'
import { loadModuleTransactions } from './loadModuleTransactions'
import { loadOutgoingTransactions } from './loadOutgoingTransactions'
import { loadHistoryTransactions, loadQueuedTransactions } from './loadGatewayTransactions'

import { addOrUpdateCancellationTransactions } from 'src/logic/safe/store/actions/transactions/addOrUpdateCancellationTransactions'
import { addOrUpdateTransactions } from 'src/logic/safe/store/actions/transactions/addOrUpdateTransactions'
import { AppReduxState } from 'src/store'

export default (safeAddress: string) => async (
  dispatch: ThunkDispatch<AppReduxState, undefined, AnyAction>,
): Promise<void> => {
  const [transactions, incomingTransactions, moduleTransactions, history, queued] = await Promise.allSettled([
    backOff(() => loadOutgoingTransactions(safeAddress)),
    backOff(() => loadIncomingTransactions(safeAddress)),
    backOff(() => loadModuleTransactions(safeAddress)),
    backOff(() => loadHistoryTransactions(safeAddress)),
    backOff(() => loadQueuedTransactions(safeAddress)),
  ])

  if (transactions.status === 'fulfilled') {
    const { cancel, outgoing } = transactions.value
    if (cancel.size) {
      dispatch(addOrUpdateCancellationTransactions({ safeAddress, transactions: cancel }))
    }
    if (outgoing.size) {
      dispatch(addOrUpdateTransactions({ safeAddress, transactions: outgoing }))
    }
  } else {
    console.error('Failed to load transactions', transactions.reason)
  }

  if (incomingTransactions.status === 'fulfilled') {
    const incomingTxs = incomingTransactions.value
    const safeIncomingTxs = incomingTxs.get(safeAddress)

    if (safeIncomingTxs?.size) {
      dispatch(addIncomingTransactions(incomingTxs))
    }
  } else {
    console.error('Failed to load incomingTransactions', incomingTransactions.reason)
  }

  if (moduleTransactions.status === 'fulfilled') {
    const moduleTxs = moduleTransactions.value
    if (moduleTxs.length) {
      dispatch(addModuleTransactions({ modules: moduleTxs, safeAddress }))
    }
  } else {
    console.error('Failed to load moduleTransactions', moduleTransactions.reason)
  }

  if (history.status === 'fulfilled') {
    const values = history.value

    if (values.length) {
      dispatch(addHistoryTransactions({ safeAddress, values }))
    }
  } else {
    console.error('Failed to load history transactions', history.reason)
  }

  if (queued.status === 'fulfilled') {
    const values = queued.value

    if (values.length) {
      dispatch(addQueuedTransactions({ safeAddress, values }))
    }
  } else {
    console.error('Failed to load queued transactions', queued.reason)
  }
}
