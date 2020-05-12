// @flow
import { List, Map } from 'immutable'
import { batch } from 'react-redux'
import type { Dispatch as ReduxDispatch } from 'redux'

import { addIncomingTransactions } from '../addIncomingTransactions'
import { addTransactions } from '../addTransactions'

import { loadIncomingTransactions } from './loadIncomingTransactions'
import { type SafeTransactionsType, loadOutgoingTransactions } from './loadOutgoingTransactions'

import { addCancellationTransactions } from '~/routes/safe/store/actions/transactions/addCancellationTransactions'
import { type IncomingTransaction } from '~/routes/safe/store/models/incomingTransaction'
import { type GlobalState } from '~/store'

export default (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>, getState: GetState) => {
  const transactions: SafeTransactionsType | typeof undefined = await loadOutgoingTransactions(safeAddress, getState)
  if (transactions) {
    const { cancel, outgoing } = transactions

    batch(() => {
      dispatch(addCancellationTransactions(cancel))
      dispatch(addTransactions(outgoing))
    })
  }

  const incomingTransactions:
    | Map<string, List<IncomingTransaction>>
    | typeof undefined = await loadIncomingTransactions(safeAddress)

  if (incomingTransactions) {
    dispatch(addIncomingTransactions(incomingTransactions))
  }
}
