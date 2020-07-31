import { batch } from 'react-redux'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { backOff } from 'exponential-backoff'

import { addIncomingTransactions } from '../../addIncomingTransactions'

import { loadIncomingTransactions } from './loadIncomingTransactions'
import { loadOutgoingTransactions } from './loadOutgoingTransactions'

import { addOrUpdateCancellationTransactions } from 'src/routes/safe/store/actions/transactions/addOrUpdateCancellationTransactions'
import { addOrUpdateTransactions } from 'src/routes/safe/store/actions/transactions/addOrUpdateTransactions'
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

    if (incomingTransactions.get(safeAddress).size) {
      dispatch(addIncomingTransactions(incomingTransactions))
    }
  } catch (error) {
    console.log('Error fetching transactions:', error)
  }
}
