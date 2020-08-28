import { handleActions } from 'redux-actions'

import {
  ADD_MODULE_TRANSACTIONS,
  AddModuleTransactionsAction,
} from 'src/logic/safe/store/actions/addModuleTransactions'
import { ModuleTxServiceModel } from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadModuleTransactions'

export const MODULE_TRANSACTIONS_REDUCER_ID = 'moduleTransactions'

export interface ModuleTransactionsState {
  [safeAddress: string]: ModuleTxServiceModel[]
}

export default handleActions(
  {
    [ADD_MODULE_TRANSACTIONS]: (state: ModuleTransactionsState, action: AddModuleTransactionsAction) => {
      const { modules, safeAddress } = action.payload
      const oldModuleTxs = state[safeAddress] ?? []
      const oldModuleTxsHashes = oldModuleTxs.map(({ transactionHash }) => transactionHash)
      // filtering in this level happens, because backend is returning the whole list of txs
      // so, to avoid re-storing all the txs, those already stored are filtered out
      const newModuleTxs = modules.filter((moduleTx) => !oldModuleTxsHashes.includes(moduleTx.transactionHash))

      return {
        ...state,
        [safeAddress]: [...oldModuleTxs, ...newModuleTxs],
      }
    },
  },
  {},
)
