import { push } from 'connected-react-router'

import { NOTIFICATIONS, enhanceSnackbarForAction } from 'src/logic/notifications'
import closeSnackbarAction from 'src/logic/notifications/store/actions/closeSnackbar'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { getAwaitingTransactions } from 'src/logic/safe/transactions/awaitingTransactions'
import { getSafeVersionInfo } from 'src/logic/safe/utils/safeVersion'
import { isUserAnOwner } from 'src/logic/wallets/ethAddresses'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { getIncomingTxAmount } from 'src/routes/safe/components/Transactions/TxsTable/columns'
import { grantedSelector } from 'src/routes/safe/container/selector'
import { ADD_INCOMING_TRANSACTIONS } from 'src/logic/safe/store/actions/addIncomingTransactions'
import { ADD_OR_UPDATE_TRANSACTIONS } from 'src/logic/safe/store/actions/transactions/addOrUpdateTransactions'
import updateSafe from 'src/logic/safe/store/actions/updateSafe'
import {
  safeParamAddressFromStateSelector,
  safesMapSelector,
  safeCancellationTransactionsSelector,
} from 'src/logic/safe/store/selectors'

import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { ADD_OR_UPDATE_SAFE } from '../actions/addOrUpdateSafe'

const watchedActions = [ADD_OR_UPDATE_TRANSACTIONS, ADD_INCOMING_TRANSACTIONS, ADD_OR_UPDATE_SAFE]

const sendAwaitingTransactionNotification = async (
  dispatch,
  safeAddress,
  awaitingTxsSubmissionDateList,
  notificationKey,
  notificationClickedCb,
) => {
  const LAST_TIME_USED_LOGGED_IN_ID = 'LAST_TIME_USED_LOGGED_IN_ID'
  if (!dispatch || !safeAddress || !awaitingTxsSubmissionDateList || !notificationKey) {
    return
  }
  if (awaitingTxsSubmissionDateList.size === 0) {
    return
  }

  let lastTimeUserLoggedInForSafes = (await loadFromStorage<Record<string, string>>(LAST_TIME_USED_LOGGED_IN_ID)) || {}
  const lastTimeUserLoggedIn =
    lastTimeUserLoggedInForSafes && lastTimeUserLoggedInForSafes[safeAddress]
      ? lastTimeUserLoggedInForSafes[safeAddress]
      : null

  const filteredDuplicatedAwaitingTxList = awaitingTxsSubmissionDateList.filter((submissionDate) => {
    return lastTimeUserLoggedIn ? new Date(submissionDate) > new Date(lastTimeUserLoggedIn) : true
  })

  if (filteredDuplicatedAwaitingTxList.size === 0) {
    return
  }
  dispatch(
    enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.TX_WAITING_MSG, notificationKey, notificationClickedCb)),
  )

  lastTimeUserLoggedInForSafes = {
    ...lastTimeUserLoggedInForSafes,
    [safeAddress]: lastTimeUserLoggedIn || new Date(),
  }
  await saveToStorage(LAST_TIME_USED_LOGGED_IN_ID, lastTimeUserLoggedInForSafes)
}

const onNotificationClicked = (dispatch, notificationKey, safeAddress) => () => {
  dispatch(closeSnackbarAction({ key: notificationKey }))
  dispatch(push(`/safes/${safeAddress}/transactions`))
}

const notificationsMiddleware = (store) => (next) => async (action) => {
  const handledAction = next(action)
  const { dispatch } = store

  if (watchedActions.includes(action.type)) {
    const state = store.getState()

    switch (action.type) {
      case ADD_OR_UPDATE_TRANSACTIONS: {
        const { safeAddress, transactions } = action.payload
        const userAddress: string = userAccountSelector(state)
        const cancellationTransactions = safeCancellationTransactionsSelector(state)
        const awaitingTransactions = getAwaitingTransactions(transactions, cancellationTransactions, userAddress)
        const awaitingTxsSubmissionDateList = awaitingTransactions.map((tx) => tx.submissionDate)

        const safes = safesMapSelector(state)
        const currentSafe = safes.get(safeAddress)

        if (!currentSafe || !isUserAnOwner(currentSafe, userAddress) || awaitingTransactions.size === 0) {
          break
        }

        const notificationKey = `${safeAddress}-awaiting`

        await sendAwaitingTransactionNotification(
          dispatch,
          safeAddress,
          awaitingTxsSubmissionDateList,
          notificationKey,
          onNotificationClicked(dispatch, notificationKey, safeAddress),
        )

        break
      }
      case ADD_INCOMING_TRANSACTIONS: {
        action.payload.forEach((incomingTransactions, safeAddress) => {
          const { latestIncomingTxBlock } = state.safes.get('safes').get(safeAddress, {})
          const viewedSafes = state.currentSession['viewedSafes']
          const recurringUser = viewedSafes?.includes(safeAddress)

          const newIncomingTransactions = incomingTransactions.filter((tx) => tx.blockNumber > latestIncomingTxBlock)

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
              newIncomingTransactions.forEach((tx) => {
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
      case ADD_OR_UPDATE_SAFE: {
        const state = store.getState()
        const { safe } = action.payload
        const currentSafeAddress = safeParamAddressFromStateSelector(state) || safe.address
        if (!currentSafeAddress) {
          break
        }
        const isUserOwner = grantedSelector(state)
        const { needUpdate } = await getSafeVersionInfo(currentSafeAddress)

        const notificationKey = `${currentSafeAddress}`
        const onNotificationClicked = () => {
          dispatch(closeSnackbarAction({ key: notificationKey }))
          dispatch(push(`/safes/${currentSafeAddress}/settings`))
        }

        if (needUpdate && isUserOwner) {
          dispatch(
            enqueueSnackbar(
              enhanceSnackbarForAction(
                NOTIFICATIONS.SAFE_NEW_VERSION_AVAILABLE,
                notificationKey,
                onNotificationClicked,
              ),
            ),
          )
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
