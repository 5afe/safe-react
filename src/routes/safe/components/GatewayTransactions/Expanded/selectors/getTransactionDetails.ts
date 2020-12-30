import { createSelector } from 'reselect'

import { StoreStructure, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { GATEWAY_TRANSACTIONS_ID } from 'src/logic/safe/store/reducer/gatewayTransactions'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { AppReduxState } from 'src/store'
import { sameString } from 'src/utils/strings'

const getTransactions = (state: AppReduxState): AppReduxState['gatewayTransactions'] => state[GATEWAY_TRANSACTIONS_ID]

const getSafeTransactions = createSelector(
  getTransactions,
  safeParamAddressFromStateSelector,
  (transactionsBySafe, safeAddress) => transactionsBySafe[safeAddress],
)

export const getTransactionDetails = createSelector(
  getSafeTransactions,
  (_, transactionId: Transaction['id'], txLocation: 'history' | 'queued.next' | 'queued.queued') => ({
    transactionId,
    txLocation,
  }),
  (transactions, { transactionId, txLocation }): Transaction['txDetails'] => {
    if (transactions) {
      for (const [, txs] of Object.entries(
        transactions[txLocation] as StoreStructure['history'] | StoreStructure['queued']['next' | 'queued'],
      )) {
        const txDetails = txs.find(({ id }) => sameString(id, transactionId))?.txDetails

        if (txDetails) {
          return txDetails
        }
      }
    }
  },
)
