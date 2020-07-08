import { NewTransactionsState, TRANSACTIONS } from '../reducer/newTransactions'

export const newTransactionsSelector = (state: NewTransactionsState) => state[TRANSACTIONS]
