import { push } from 'connected-react-router'
import { Action } from 'redux-actions'

import { NOTIFICATIONS, enhanceSnackbarForAction } from 'src/logic/notifications'
import closeSnackbarAction from 'src/logic/notifications/store/actions/closeSnackbar'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { getAwaitingGatewayTransactions } from 'src/logic/safe/transactions/awaitingTransactions'
import { getSafeVersionInfo } from 'src/logic/safe/utils/safeVersion'
import { isUserAnOwner } from 'src/logic/wallets/ethAddresses'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { grantedSelector } from 'src/routes/safe/container/selector'
import {
  ADD_QUEUED_TRANSACTIONS,
  ADD_HISTORY_TRANSACTIONS,
} from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import * as aboutToExecuteTx from 'src/logic/safe/utils/aboutToExecuteTx'
import { QueuedPayload } from 'src/logic/safe/store/reducer/gatewayTransactions'
import { safeAddressFromUrl, safesAsMap } from 'src/logic/safe/store/selectors'

import { isTransactionSummary, TransactionGatewayResult } from 'src/logic/safe/store/models/types/gateway.d'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { ADD_OR_UPDATE_SAFE } from '../actions/addOrUpdateSafe'

const watchedActions = [ADD_OR_UPDATE_SAFE, ADD_QUEUED_TRANSACTIONS, ADD_HISTORY_TRANSACTIONS]

const LAST_TIME_USED_LOGGED_IN_ID = 'LAST_TIME_USED_LOGGED_IN_ID'

const sendAwaitingTransactionNotification = async (
  dispatch,
  safeAddress,
  awaitingTxsSubmissionDateList,
  notificationKey,
  notificationClickedCb,
) => {
  if (!dispatch || !safeAddress || !awaitingTxsSubmissionDateList || !notificationKey) {
    return
  }
  if (awaitingTxsSubmissionDateList.length === 0) {
    return
  }

  let lastTimeUserLoggedInForSafes = (await loadFromStorage<Record<string, string>>(LAST_TIME_USED_LOGGED_IN_ID)) || {}
  const lastTimeUserLoggedIn = lastTimeUserLoggedInForSafes[safeAddress]
    ? lastTimeUserLoggedInForSafes[safeAddress]
    : null

  const filteredDuplicatedAwaitingTxList = awaitingTxsSubmissionDateList.filter((submissionDate) => {
    return lastTimeUserLoggedIn ? new Date(submissionDate) > new Date(lastTimeUserLoggedIn) : true
  })

  if (!filteredDuplicatedAwaitingTxList.length) {
    return
  }

  dispatch(
    enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.TX_WAITING_MSG, notificationKey, notificationClickedCb)),
  )

  lastTimeUserLoggedInForSafes = {
    ...lastTimeUserLoggedInForSafes,
    [safeAddress]: new Date(),
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
      case ADD_HISTORY_TRANSACTIONS: {
        const userAddress: string = userAccountSelector(state)
        const safesMap = safesAsMap(state)

        const executedTxNotification = aboutToExecuteTx.getNotification(action.payload, userAddress, safesMap)
        // if we have a notification, dispatch it depending on transaction's status
        executedTxNotification && dispatch(enqueueSnackbar(executedTxNotification))

        break
      }
      case ADD_QUEUED_TRANSACTIONS: {
        const { safeAddress, values } = (action as Action<QueuedPayload>).payload
        const transactions = values
          .filter((tx) => isTransactionSummary(tx))
          .map((item: TransactionGatewayResult) => item.transaction)
        const userAddress: string = userAccountSelector(state)
        const awaitingTransactions = getAwaitingGatewayTransactions(transactions, userAddress)

        const awaitingTxsSubmissionDateList = awaitingTransactions.map((tx) => tx.timestamp)

        const safesMap = safesAsMap(state)
        const currentSafe = safesMap.get(safeAddress)

        if (!currentSafe || !isUserAnOwner(currentSafe, userAddress) || awaitingTransactions.length === 0) {
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
      case ADD_OR_UPDATE_SAFE: {
        const state = store.getState()
        const { safe } = action.payload
        const currentSafeAddress = safeAddressFromUrl(state) || safe.address
        if (!currentSafeAddress) {
          break
        }
        const isUserOwner = grantedSelector(state)
        const version = await getSafeVersionInfo(currentSafeAddress)

        const notificationKey = `${currentSafeAddress}`
        const onNotificationClicked = () => {
          dispatch(closeSnackbarAction({ key: notificationKey }))
          dispatch(push(`/safes/${currentSafeAddress}/settings`))
        }

        if (version?.needUpdate && isUserOwner) {
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
