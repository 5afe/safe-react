import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { backOff } from 'exponential-backoff'

import { addIncomingTransactions } from 'src/logic/safe/store/actions/addIncomingTransactions'
import { addModuleTransactions } from 'src/logic/safe/store/actions/addModuleTransactions'

import { loadIncomingTransactions } from './loadIncomingTransactions'
import { loadModuleTransactions } from './loadModuleTransactions'
import { loadOutgoingTransactions } from './loadOutgoingTransactions'

import { addOrUpdateCancellationTransactions } from 'src/logic/safe/store/actions/transactions/addOrUpdateCancellationTransactions'
import { addOrUpdateTransactions } from 'src/logic/safe/store/actions/transactions/addOrUpdateTransactions'
import { AppReduxState } from 'src/store'

export default (safeAddress: string) => async (
  dispatch: ThunkDispatch<AppReduxState, undefined, AnyAction>,
): Promise<void> => {
  try {
    const [transactions, incomingTransactions, moduleTransactions] = await Promise.allSettled([
      backOff(() => loadOutgoingTransactions(safeAddress)),
      backOff(() => loadIncomingTransactions(safeAddress)),
      backOff(() => loadModuleTransactions(safeAddress)),
    ])

    if (transactions.status === 'fulfilled') {
      const { cancel, outgoing } = transactions.value

      if (cancel.size) {
        dispatch(addOrUpdateCancellationTransactions({ safeAddress, transactions: cancel }))
      }

      if (outgoing.size) {
        dispatch(addOrUpdateTransactions({ safeAddress, transactions: outgoing }))
      }
    }

    if (incomingTransactions.status === 'fulfilled') {
      const incomingTxs = incomingTransactions.value
      const safeIncomingTxs = incomingTxs.get(safeAddress)

      if (safeIncomingTxs?.size) {
        dispatch(addIncomingTransactions(incomingTxs))
      }
    }

    if (moduleTransactions.status === 'fulfilled') {
      const moduleTxs = moduleTransactions.value

      if (moduleTxs.length) {
        dispatch(addModuleTransactions({ modules: moduleTxs, safeAddress }))
      }
    }
  } catch (error) {
    console.log('Error fetching transactions:', error)
  }
}
