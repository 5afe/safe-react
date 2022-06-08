import { Action } from 'redux-actions'
import { AnyAction } from 'redux'
import { TransactionListItem, Transaction, TransactionSummary } from '@gnosis.pm/safe-react-gateway-sdk'

import { NOTIFICATIONS } from 'src/logic/notifications'
import { closeNotification, showNotification } from 'src/logic/notifications/store/notifications'
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
import { currentSafe, safesAsMap } from 'src/logic/safe/store/selectors'
import { isTransactionSummary } from 'src/logic/safe/store/models/types/gateway.d'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { store as reduxStore } from 'src/store/index'
import { HistoryPayload } from 'src/logic/safe/store/reducer/gatewayTransactions'
import { history, generateSafeRoute, SAFE_ROUTES } from 'src/routes/routes'
import { isTxPending } from 'src/logic/safe/store/selectors/pendingTransactions'
import { PROVIDER_ACTIONS } from 'src/logic/wallets/store/actions'
import { ADD_CURRENT_SAFE_ADDRESS } from 'src/logic/currentSession/store/actions/addCurrentSafeAddress'

const LAST_TIME_USED_LOGGED_IN_ID = 'LAST_TIME_USED_LOGGED_IN_ID'

const sendAwaitingTransactionNotification = (
  dispatch,
  safeAddress,
  awaitingTxsSubmissionDateList,
  notificationKey,
  notificationClickedCb,
): void => {
  if (!dispatch || !safeAddress || !awaitingTxsSubmissionDateList || !notificationKey) {
    return
  }
  if (awaitingTxsSubmissionDateList.length === 0) {
    return
  }

  let lastTimeUserLoggedInForSafes = loadFromStorage<Record<string, string>>(LAST_TIME_USED_LOGGED_IN_ID) || {}
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
    showNotification({
      ...NOTIFICATIONS.TX_WAITING_MSG,
      options: {
        ...NOTIFICATIONS.TX_WAITING_MSG.options,
        onClick: notificationClickedCb,
        key: notificationKey,
      },
    }),
  )

  lastTimeUserLoggedInForSafes = {
    ...lastTimeUserLoggedInForSafes,
    [safeAddress]: new Date(),
  }
  saveToStorage(LAST_TIME_USED_LOGGED_IN_ID, lastTimeUserLoggedInForSafes)
}

// any/AnyAction used as our Redux state is not typed
const notificationsMiddleware =
  (store: ReturnType<typeof reduxStore>) =>
  (next: (arg0: any) => any) =>
  async (action: Action<AnyAction>): Promise<any> => {
    const handledAction = next(action)
    const { dispatch } = store

    const state = store.getState()

    const { currentShortName, currentSafeAddress } = state.currentSession

    switch (action.type) {
      case ADD_HISTORY_TRANSACTIONS: {
        const userAddress: string = userAccountSelector(state)
        const safesMap = safesAsMap(state)

        const executedTxNotification = aboutToExecuteTx.getNotification(
          action.payload as unknown as HistoryPayload,
          userAddress,
          safesMap,
        )
        // if we have a notification, dispatch it depending on transaction's status
        executedTxNotification && dispatch(showNotification(executedTxNotification))

        break
      }
      case ADD_QUEUED_TRANSACTIONS: {
        const { safeAddress, values } = action.payload
        const transactions: TransactionSummary[] = values
          .filter((tx) => isTransactionSummary(tx))
          .map((item: TransactionListItem) => (item as Transaction).transaction)
        const userAddress: string = userAccountSelector(state)
        const awaitingTransactions = getAwaitingGatewayTransactions(transactions, userAddress)

        const awaitingTxsSubmissionDateList = awaitingTransactions.map((tx) => tx.timestamp)

        const safesMap = safesAsMap(state)
        const currentSafe = safesMap.get(safeAddress)

        const hasPendingTx = transactions.some(({ id }) => isTxPending(state, id))

        if (
          hasPendingTx ||
          !currentSafe ||
          !isUserAnOwner(currentSafe, userAddress) ||
          awaitingTransactions.length === 0
        ) {
          break
        }

        const notificationKey = `${safeAddress}-awaiting`

        const onNotificationClicked = () => {
          dispatch(closeNotification({ key: notificationKey }))
          history.push(
            generateSafeRoute(SAFE_ROUTES.TRANSACTIONS_HISTORY, {
              shortName: currentShortName,
              safeAddress,
            }),
          )
        }

        sendAwaitingTransactionNotification(
          dispatch,
          safeAddress,
          awaitingTxsSubmissionDateList,
          notificationKey,
          onNotificationClicked,
        )

        break
      }
      // Notify when switching between Safes
      case ADD_CURRENT_SAFE_ADDRESS:
      // Notify when connecting with open Safe
      case PROVIDER_ACTIONS.ACCOUNT: {
        const safe = currentSafe(state)
        const curSafeAddress = currentSafeAddress || safe.address
        if (!curSafeAddress || !safe.currentVersion) {
          break
        }
        const isUserOwner = grantedSelector(state)
        const version = await getSafeVersionInfo(safe.currentVersion)

        const notificationKey = `${curSafeAddress}-update`
        const onNotificationClicked = () => {
          dispatch(closeNotification({ key: notificationKey }))
          history.push(
            generateSafeRoute(SAFE_ROUTES.SETTINGS_DETAILS, {
              shortName: currentShortName,
              safeAddress: curSafeAddress,
            }),
          )
        }

        if (version?.needUpdate && isUserOwner) {
          dispatch(
            showNotification({
              ...NOTIFICATIONS.SAFE_NEW_VERSION_AVAILABLE,
              options: {
                ...NOTIFICATIONS.SAFE_NEW_VERSION_AVAILABLE.options,
                key: notificationKey,
                onClick: onNotificationClicked,
              },
            }),
          )
        }
        break
      }
      default:
        break
    }

    return handledAction
  }

export default notificationsMiddleware
