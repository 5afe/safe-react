// @flow
import { push } from 'connected-react-router'
import { List, Map } from 'immutable'
import type { Action, Store } from 'redux'

import { NOTIFICATIONS, enhanceSnackbarForAction } from '~/logic/notifications'
import closeSnackbarAction from '~/logic/notifications/store/actions/closeSnackbar'
import enqueueSnackbar from '~/logic/notifications/store/actions/enqueueSnackbar'
import { getAwaitingTransactions } from '~/logic/safe/transactions/awaitingTransactions'
import { getSafeVersion } from '~/logic/safe/utils/safeVersion'
import { isUserOwner } from '~/logic/wallets/ethAddresses'
import { userAccountSelector } from '~/logic/wallets/store/selectors'
import { getIncomingTxAmount } from '~/routes/safe/components/Transactions/TxsTable/columns'
import { grantedSelector } from '~/routes/safe/container/selector'
import { ADD_INCOMING_TRANSACTIONS } from '~/routes/safe/store/actions/addIncomingTransactions'
import { ADD_SAFE } from '~/routes/safe/store/actions/addSafe'
import { ADD_TRANSACTIONS } from '~/routes/safe/store/actions/addTransactions'
import updateSafe from '~/routes/safe/store/actions/updateSafe'
import { safeParamAddressFromStateSelector, safesMapSelector } from '~/routes/safe/store/selectors'
import { type GlobalState } from '~/store/'
import { loadFromStorage, saveToStorage } from '~/utils/storage'

const watchedActions = [ADD_TRANSACTIONS, ADD_INCOMING_TRANSACTIONS, ADD_SAFE]

const sendAwaitingTransactionNotification = async (
  dispatch: Function,
  safeAddress: string,
  awaitingTxsSubmissionDateList: List[],
  notificationKey: string,
  notificationClickedCb: Function,
) => {
  const LAST_TIME_USED_LOGGED_IN_ID = 'LAST_TIME_USED_LOGGED_IN_ID'
  if (!dispatch || !safeAddress || !awaitingTxsSubmissionDateList || !notificationKey) {
    return
  }
  if (awaitingTxsSubmissionDateList.size === 0) {
    return
  }

  let lastTimeUserLoggedInForSafes = (await loadFromStorage(LAST_TIME_USED_LOGGED_IN_ID)) || []
  let lastTimeUserLoggedIn =
    lastTimeUserLoggedInForSafes && lastTimeUserLoggedInForSafes[safeAddress]
      ? lastTimeUserLoggedInForSafes[safeAddress]
      : null

  const filteredDuplicatedAwaitingTxList = awaitingTxsSubmissionDateList.filter(submissionDate => {
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
        const awaitingTxsSubmissionDateList = awaitingTransactions
          .get(safeAddress, List([]))
          .map(tx => tx.submissionDate)

        const safes = safesMapSelector(state)
        const currentSafe = safes.get(safeAddress)

        if (!isUserOwner(currentSafe, userAddress) || awaitingTxsSubmissionDateList.size === 0) {
          break
        }
        const notificationKey = `${safeAddress}-awaiting`
        const onNotificationClicked = () => {
          dispatch(closeSnackbarAction({ key: notificationKey }))
          dispatch(push(`/safes/${safeAddress}/transactions`))
        }

        await sendAwaitingTransactionNotification(
          dispatch,
          safeAddress,
          awaitingTxsSubmissionDateList,
          notificationKey,
          onNotificationClicked,
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
        const state: GlobalState = store.getState()
        const currentSafeAddress = safeParamAddressFromStateSelector(state)
        const isUserOwner = grantedSelector(state)
        const { needUpdate } = await getSafeVersion(currentSafeAddress)

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
