import { batch } from 'react-redux'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
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

const noFunc = () => {}

export default (safeAddress: string): ThunkAction<Promise<void>, AppReduxState, undefined, AnyAction> => async (
  dispatch: ThunkDispatch<AppReduxState, undefined, AnyAction>,
): Promise<void> => {
  try {
    const transactions = await backOff(() => loadOutgoingTransactions(safeAddress))

    if (transactions) {
      const { cancel, outgoing } = transactions
      const updateCancellationTxs = cancel.size
        ? addOrUpdateCancellationTransactions({ safeAddress, transactions: cancel })
        : noFunc
      const updateOutgoingTxs = outgoing.size
        ? addOrUpdateTransactions({
            safeAddress,
            transactions: outgoing,
          })
        : noFunc

      batch(() => {
        dispatch(updateCancellationTxs)
        dispatch(updateOutgoingTxs)
      })
    }

    const incomingTransactions = await loadIncomingTransactions(safeAddress)
    const safeIncomingTxs = incomingTransactions.get(safeAddress)

    if (safeIncomingTxs?.size) {
      dispatch(addIncomingTransactions(incomingTransactions))
    }

    const moduleTransactions = await loadModuleTransactions(safeAddress)

    if (moduleTransactions.length) {
      dispatch(addModuleTransactions({ modules: moduleTransactions, safeAddress }))
    }
  } catch (error) {
    console.log('Error fetching transactions:', error)
  }
}
