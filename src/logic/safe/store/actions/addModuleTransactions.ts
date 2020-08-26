import { createAction } from 'redux-actions'
import { ModuleTxServiceModel } from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadModuleTransactions'

export const ADD_MODULE_TRANSACTIONS = 'ADD_MODULE_TRANSACTIONS'

export type AddModuleTransactionsAction = {
  payload: {
    safeAddress: string
    modules: ModuleTxServiceModel[]
  }
}

export const addModuleTransactions = createAction(ADD_MODULE_TRANSACTIONS)
