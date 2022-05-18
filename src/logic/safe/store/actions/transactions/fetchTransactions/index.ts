import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { parse } from 'querystring'

import {
  addHistoryTransactions,
  addQueuedTransactions,
} from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import { loadHistoryTransactions, loadQueuedTransactions } from './loadGatewayTransactions'
import { AppReduxState } from 'src/store'
import { history } from 'src/routes/routes'
import { isTxFilter } from 'src/routes/safe/components/Transactions/TxList/Filter/utils'

export default (chainId: string, safeAddress: string) =>
  async (dispatch: ThunkDispatch<AppReduxState, undefined, AnyAction>): Promise<void> => {
    const loadHistory = async () => {
      try {
        const query = parse(history.location.search.slice(1))
        const filter = isTxFilter(query) ? query : undefined
        const values = await loadHistoryTransactions(safeAddress, filter)
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
