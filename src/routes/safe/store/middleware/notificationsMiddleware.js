// @flow
import type { Action, Store } from 'redux'
import { List, Map } from 'immutable'
import { push } from 'connected-react-router'
import { type GlobalState } from '~/store/'
import { ADD_TRANSACTIONS } from '~/routes/safe/store/actions/addTransactions'
import { ADD_INCOMING_TRANSACTIONS } from '~/routes/safe/store/actions/addIncomingTransactions'
import { getAwaitingTransactions } from '~/logic/safe/transactions/awaitingTransactions'
import { userAccountSelector } from '~/logic/wallets/store/selectors'
import enqueueSnackbar from '~/logic/notifications/store/actions/enqueueSnackbar'
import { enhanceSnackbarForAction, NOTIFICATIONS } from '~/logic/notifications'
import closeSnackbarAction from '~/logic/notifications/store/actions/closeSnackbar'
import { getIncomingTxAmount } from '~/routes/safe/components/Transactions/TxsTable/columns'
import updateSafe from '~/routes/safe/store/actions/updateSafe'
import { safesMapSelector } from '~/routes/safe/store/selectors'
import { isUserOwner } from '~/logic/wallets/ethAddresses'
import { ADD_SAFE } from '~/routes/safe/store/actions/addSafe'
import { getSafeVersion } from '~/logic/safe/utils/safeVersion'

const watchedActions = [ADD_TRANSACTIONS, ADD_INCOMING_TRANSACTIONS, ADD_SAFE]

const notificationsMiddleware = (store: Store<GlobalState>) => (next: Function) => async (action: Action<*>) => {
  const handledAction = next(action)
  const { dispatch } = store

  if (watchedActions.includes(action.type)) {
    const state: GlobalState = store.getState()
    switch (action.type) {
      case ADD_TRANSACTIONS: {
        const transactionsList = action.payload
        const userAddress: string = userAccountSelector(state)
        const safeAddress = action.payload.keySeq().get(0)
        const cancellationTransactions = state.cancellationTransactions.get(safeAddress)
        const cancellationTransactionsByNonce = cancellationTransactions
          ? cancellationTransactions.reduce((acc, tx) => acc.set(tx.nonce, tx), Map())
          : Map()
        const awaitingTransactions = getAwaitingTransactions(
          transactionsList,
          cancellationTransactionsByNonce,
          userAddress,
        )
        const awaitingTransactionsList = awaitingTransactions.get(safeAddress, List([]))
        const safes = safesMapSelector(state)
        const currentSafe = safes.get(safeAddress)

        if (!isUserOwner(currentSafe, userAddress) || awaitingTransactionsList.size === 0) {
          break
        }

        const notificationKey = `${safeAddress}-${userAddress}`
        const onNotificationClicked = () => {
          dispatch(closeSnackbarAction({ key: notificationKey }))
          dispatch(push(`/safes/${safeAddress}/transactions`))
        }
        dispatch(
          enqueueSnackbar(
            enhanceSnackbarForAction(NOTIFICATIONS.TX_WAITING_MSG, notificationKey, onNotificationClicked),
          ),
        )

        break
      }
      case ADD_INCOMING_TRANSACTIONS: {
        action.payload.forEach((incomingTransactions, safeAddress) => {
          const { latestIncomingTxBlock } = state.safes.get('safes').get(safeAddress)
          const viewedSafes = state.currentSession ? state.currentSession.get('viewedSafes') : []
          const recurringUser = viewedSafes.includes(safeAddress)

          const newIncomingTransactions = incomingTransactions.filter(tx => tx.blockNumber > latestIncomingTxBlock)

          const { message, ...TX_INCOMING_MSG } = NOTIFICATIONS.TX_INCOMING_MSG

          if (recurringUser) {
            if (newIncomingTransactions.size > 3) {
              dispatch(
                enqueueSnackbar(
                  enhanceSnackbarForAction({
                    ...TX_INCOMING_MSG,
                    message: 'Multiple incoming transfers',
                  }),
                ),
              )
            } else {
              newIncomingTransactions.forEach(tx => {
                dispatch(
                  enqueueSnackbar(
                    enhanceSnackbarForAction({
                      ...TX_INCOMING_MSG,
                      message: `${message}${getIncomingTxAmount(tx)}`,
                    }),
                  ),
                )
              })
            }
          }

          dispatch(
            updateSafe({
              address: safeAddress,
              latestIncomingTxBlock: newIncomingTransactions.size
                ? newIncomingTransactions.first().blockNumber
                : latestIncomingTxBlock,
            }),
          )
        })
        break
      }
      case ADD_SAFE: {
        const { needUpdate } = await getSafeVersion()
        const { safe } = action.payload
        const notificationKey = `${safe.address}`
        if (needUpdate) {
          dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.SAFE_NEW_VERSION_AVAILABLE, notificationKey)))
        }
        break
      }
      default:
        break
    }
  }

  return handledAction
}

export default notificationsMiddleware
