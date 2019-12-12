// @flow
import type { AnyAction, Store } from 'redux'
import { push } from 'connected-react-router'
import { type GlobalState } from '~/store/'
import { ADD_TRANSACTIONS } from '~/routes/safe/store/actions/addTransactions'
import { getAwaitingTransactions } from '~/logic/safe/transactions/awaitingTransactions'
import { userAccountSelector } from '~/logic/wallets/store/selectors'
import enqueueSnackbar from '~/logic/notifications/store/actions/enqueueSnackbar'
import { enhanceSnackbarForAction, NOTIFICATIONS } from '~/logic/notifications'
import closeSnackbarAction from '~/logic/notifications/store/actions/closeSnackbar'
import { isUserOwner } from '~/logic/wallets/ethAddresses'
import { safeParamAddressFromStateSelector, safesMapSelector } from '~/routes/safe/store/selectors'

const watchedActions = [
  ADD_TRANSACTIONS,
]

const notificationsMiddleware = (store: Store<GlobalState>) => (next: Function) => async (action: AnyAction) => {
  const handledAction = next(action)
  const { dispatch } = store

  if (watchedActions.includes(action.type)) {
    const state: GlobalState = store.getState()
    switch (action.type) {
      case ADD_TRANSACTIONS: {
        const transactionsList = action.payload
        const userAddress: string = userAccountSelector(state)
        const awaitingTransactions = getAwaitingTransactions(transactionsList, userAddress)
        const safes = safesMapSelector(state)
        const safeAddress = safeParamAddressFromStateSelector(state)
        const currentSafe = safes.get(safeAddress)

        // If the user is not an owner, do not send notifications
        if (!isUserOwner(currentSafe, userAddress)) {
          break
        }

        awaitingTransactions.map((awaitingTransactionsList, txSafeAddress) => {
          const convertedList = awaitingTransactionsList.toJS()
          const notificationKey = `${txSafeAddress}-${userAddress}`
          const onNotificationClicked = () => {
            dispatch(closeSnackbarAction({ key: notificationKey }))
            dispatch(push(`/safes/${txSafeAddress}/transactions`))
          }
          if (convertedList.length > 0) {
            dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.TX_WAITING_MSG, notificationKey, onNotificationClicked)))
          }
        })
        break
      }
      default:
        break
    }
  }

  return handledAction
}

export default notificationsMiddleware
