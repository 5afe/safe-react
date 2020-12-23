import { createSelector } from 'reselect'

import { StoreStructure } from 'src/logic/safe/store/models/types/gateway'
import { GATEWAY_TRANSACTIONS_ID } from 'src/logic/safe/store/reducer/gatewayTransactions'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { AppReduxState } from 'src/store'

export const gatewayTransactions = (state: AppReduxState): AppReduxState['gatewayTransactions'] => {
  return state[GATEWAY_TRANSACTIONS_ID]
}

export const historyTransactions = createSelector(
  gatewayTransactions,
  safeParamAddressFromStateSelector,
  (gatewayTransactions, safeAddress): StoreStructure['history'] | undefined => {
    return gatewayTransactions[safeAddress]?.history
  },
)

export const pendingTransactions = createSelector(
  gatewayTransactions,
  safeParamAddressFromStateSelector,
  (gatewayTransactions, safeAddress): StoreStructure['queued'] | undefined => {
    return gatewayTransactions[safeAddress]?.queued
  },
)

export const nextTransactions = createSelector(pendingTransactions, (pendingTransactions):
  | StoreStructure['queued']['next']
  | undefined => {
  return pendingTransactions?.next
})

export const queuedTransactions = createSelector(pendingTransactions, (pendingTransactions):
  | StoreStructure['queued']['queued']
  | undefined => {
  return pendingTransactions?.queued
})
