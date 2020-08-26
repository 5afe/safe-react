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
      const oldState = state[safeAddress]

      return {
        ...state,
        [safeAddress]: {
          ...oldState,
          ...modules,
        },
      }
    },
  },
  {},
)
