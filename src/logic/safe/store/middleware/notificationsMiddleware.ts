import { Action } from 'redux-actions'
import { AnyAction } from 'redux'
import { TransactionListItem, Transaction, TransactionSummary } from '@gnosis.pm/safe-react-gateway-sdk'

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
import { safesAsMap } from 'src/logic/safe/store/selectors'
import { isTransactionSummary } from 'src/logic/safe/store/models/types/gateway.d'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { ADD_OR_UPDATE_SAFE } from '../actions/addOrUpdateSafe'
import { store as reduxStore } from 'src/store/index'
import { HistoryPayload } from 'src/logic/safe/store/reducer/gatewayTransactions'
import { history, extractSafeAddress, generateSafeRoute, ADDRESSED_ROUTE, SAFE_ROUTES } from 'src/routes/routes'
import { getShortName } from 'src/config'
import { getLocalTxStatus, localStatuses } from '../selectors/txStatus'
import { currentChainId } from 'src/logic/config/store/selectors'

const watchedActions = [ADD_OR_UPDATE_SAFE, ADD_QUEUED_TRANSACTIONS, ADD_HISTORY_TRANSACTIONS]

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
    enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.TX_WAITING_MSG, notificationKey, notificationClickedCb)),
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

    if (watchedActions.includes(action.type)) {
      const state = store.getState()

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
          executedTxNotification && dispatch(enqueueSnackbar(executedTxNotification))

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

          const hasLocalStatus = transactions.some((tx) => {
            // Check if the local status is different from the backend status
            const status = getLocalTxStatus(localStatuses(state), currentChainId(state), tx)
            return status !== tx.txStatus
          })

          if (
            hasLocalStatus ||
            !currentSafe ||
            !isUserAnOwner(currentSafe, userAddress) ||
            awaitingTransactions.length === 0
          ) {
            break
          }

          const notificationKey = `${safeAddress}-awaiting`

          const onNotificationClicked = (dispatch, notificationKey) => () => {
            dispatch(closeSnackbarAction({ key: notificationKey }))
            history.push(
              generateSafeRoute(SAFE_ROUTES.TRANSACTIONS_HISTORY, {
                shortName: getShortName(),
                safeAddress,
              }),
            )
          }

          sendAwaitingTransactionNotification(
            dispatch,
            safeAddress,
            awaitingTxsSubmissionDateList,
            notificationKey,
            onNotificationClicked(dispatch, notificationKey),
          )

          break
        }
        case ADD_OR_UPDATE_SAFE: {
          const state = store.getState()
          const safe = action.payload
          const currentSafeAddress = extractSafeAddress() || safe.address
          if (!currentSafeAddress || !safe.currentVersion) {
            break
          }
          const isUserOwner = grantedSelector(state)
          const version = await getSafeVersionInfo(safe.currentVersion)

          const notificationKey = `${currentSafeAddress}-update`
          const onNotificationClicked = () => {
            dispatch(closeSnackbarAction({ key: notificationKey }))
            history.push(
              generateSafeRoute(ADDRESSED_ROUTE, {
                shortName: getShortName(),
                safeAddress: currentSafeAddress,
              }),
            )
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
