import { batch } from 'react-redux'

import { addIncomingTransactions } from '../../addIncomingTransactions'
import { addTransactions } from '../../addTransactions'

import { loadIncomingTransactions } from './loadIncomingTransactions'
import { loadOutgoingTransactions } from './loadOutgoingTransactions'

import { addCancellationTransaction } from '../addCancellationTransaction'

export default (safeAddress: string) => async (dispatch, getState) => {
  const transactions: any | typeof undefined = await loadOutgoingTransactions(safeAddress, getState)
  if (transactions) {
    const { cancel, outgoing } = transactions

    batch(() => {
      dispatch(addCancellationTransaction(cancel))
      dispatch(addTransactions(outgoing))
    })
  }

  const incomingTransactions: any | typeof undefined = await loadIncomingTransactions(safeAddress)

  if (incomingTransactions) {
    dispatch(addIncomingTransactions(incomingTransactions))
  }
}
