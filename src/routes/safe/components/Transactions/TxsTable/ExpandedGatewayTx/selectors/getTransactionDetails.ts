import { createSelector } from 'reselect'

import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { INCOMING_TRANSACTIONS_REDUCER_ID } from 'src/logic/safe/store/reducer/incomingTransactions'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { AppReduxState } from 'src/store'
import { sameString } from 'src/utils/strings'

// TODO: this selector will evolve until we have consolidated the store with the gatewayClient endpoint info
const getTransactions = (state: AppReduxState): AppReduxState['incomingTransactions'] =>
  state[INCOMING_TRANSACTIONS_REDUCER_ID]

const getSafeTransactions = createSelector(
  getTransactions,
  safeParamAddressFromStateSelector,
  (transactionsBySafe, safeAddress) => transactionsBySafe.get(safeAddress),
)

export const getTransactionDetails = createSelector(
  getSafeTransactions,
  (_, transactionId: Transaction['id']) => transactionId,
  (transactions, transactionId): Transaction['txDetails'] =>
    transactions?.find(({ id }) => sameString(id, transactionId))?.txDetails,
)
